<?php
/*
* Plugin Name: Poll Manager
* Plugin URI: https://github.com/ls-root/smgnews/tree/main/poll-manager
* Description: Manage Polls for smgnews
* Version: 0.1
* Author: Finn Joshua Bartels
* Author URI: https://fiosproject.de
* License: GPL v2 or later
* License URI: https://www.gnu.org/licenses/gpl-2.0.html
* Text Domain: poll-manager
*/
add_action('admin_menu', 'poll_manager_register_menus');

function poll_manager_register_menus()
{
  add_menu_page(
    'Umfragen Verwalten',          // Page title
    'Umfragen',                    // Menu title
    'manage_options',              // Capability
    'poll-manager',                // Menu slug
    'poll_manager_main_page',      // Callback
    'dashicons-chart-line',        // Icon
    30                             // Position
  );

  // Settings submenu under the same menu
  add_submenu_page(
    'poll-manager',                // Parent slug
    'Server Einstellungen',        // Page title
    'Einstellungen',               // Submenu title
    'manage_options',              // Capability
    'poll-manager-settings',       // Menu slug
    'poll_manager_render_settings' // Callback
  );

  // Hidden add poll menu
  add_submenu_page(
    null,                          // Hidden
    'Neue Umfrage hinzufügen',     // Page title
    'Neue Umfrage',                // Submenu title
    'manage_options',              // Capability
    'poll-manager-add',            // Menu slug
    'poll_manager_render_add_page' // Callback
  );


  add_submenu_page(
    null,                           // Hidden
    'Umfrage bearbeiten',           // Page title
    'Umfrage bearbeiten',           // Menu title
    'manage_options',               // Capability
    'poll-manager-edit',            // Slug
    'poll_manager_render_edit_page' // Callback
  );
}

// Helpers
function poll_manager_get_settings()
{
  $defaults = array(
    "api_root" => "",
    "api_password" => ""
  );
  $options = get_option("poll_manager_settings", array());
  return wp_parse_args($options, $defaults);
}

add_action('admin_post_poll_manager_update_poll', 'poll_manager_handle_update_poll');

function poll_manager_handle_update_poll()
{
  if (!current_user_can('manage_options')) wp_die('Unauthorized');

  $poll_id = intval($_POST['poll_id']);
  check_admin_referer('poll_manager_edit_nonce_' . $poll_id, 'poll_nonce');

  // Sanitize
  $question = sanitize_text_field($_POST['poll_question']);
  $answers = isset($_POST['poll_answers']) ? array_map('sanitize_text_field', $_POST['poll_answers']) : array();
  $answers = array_filter($answers);

  if (empty($question) || count($answers) < 2) {
    wp_die('Frage und mind. 2 Antworten erforderlich.');
  }

  $settings = poll_manager_get_settings();
  $api_root = trim($settings['api_root']);
  $token = poll_manager_request_token();

  if (is_wp_error($token)) wp_die($token->get_error_message());

  $url = trailingslashit($api_root) . 'poll/' . $poll_id;
  $body = array(
    'question' => $question,
    'answers'  => $answers
  );

  $response = wp_remote_post($url, array(
    'headers' => array(
      'Authorization' => 'Bearer ' . $token,
      'Content-Type'  => 'application/json',
    ),
    'body'    => wp_json_encode($body),
    'timeout' => 15,
  ));

  if (is_wp_error($response)) {
    wp_die('API Update failed: ' . $response->get_error_message());
  }

  $code = wp_remote_retrieve_response_code($response);
  if ($code === 200) {
    wp_redirect(admin_url('admin.php?page=poll-manager&status=updated'));
    exit;
  } else {
    wp_die('Fehler beim Speichern: ' . esc_html($code));
  }
}

add_action('admin_post_poll_manager_delete', 'poll_manager_handle_delete');

function poll_manager_handle_delete()
{
  if (!current_user_can('manage_options')) {
    wp_die('Unauthorized');
  }

  // "poll_ids" comes from bulk select (array), "id" from single link (string/int)
  $ids = array();

  if (isset($_POST['poll_ids']) && is_array($_POST['poll_ids'])) {
    // Bulk action
    check_admin_referer('poll_manager_bulk_action', 'poll_manager_nonce');
    $ids = array_map('intval', $_POST['poll_ids']);
  } elseif (isset($_GET['id'])) {
    // Single link action
    $id = intval($_GET['id']);
    check_admin_referer('poll_manager_delete_' . $id);
    $ids[] = $id;
  }

  if (empty($ids)) {
    wp_redirect(admin_url('admin.php?page=poll-manager&error=no_ids'));
    exit;
  }

  $settings = poll_manager_get_settings();
  $api_root = trim($settings['api_root']);
  $token = poll_manager_request_token();

  if (empty($api_root) || is_wp_error($token)) {
    wp_die('API Config Error');
  }

  $deleted_count = 0;
  foreach ($ids as $poll_id) {
    $url = trailingslashit($api_root) . 'poll/' . $poll_id;

    $response = wp_remote_request($url, array(
      'method'  => 'DELETE',
      'headers' => array(
        'Authorization' => 'Bearer ' . $token
      ),
      'timeout' => 15
    ));

    if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
      $deleted_count++;
    }
  }

  wp_redirect(admin_url('admin.php?page=poll-manager&deleted=' . $deleted_count));
  exit;
}

add_action('admin_post_poll_manager_create_poll', 'poll_manager_handle_create_poll');

function poll_manager_handle_create_poll()
{
  if (!current_user_can('manage_options')) {
    wp_die('Unauthorized');
  }
  check_admin_referer('poll_manager_create_nonce', 'poll_nonce');

  $question = sanitize_text_field($_POST['poll_question']);
  $answers = isset($_POST['poll_answers']) ? array_map('sanitize_text_field', $_POST['poll_answers']) : array();

  // Remove empty answers
  $answers = array_filter($answers);

  if (empty($question) || count($answers) < 2) {
    wp_die('Fehler: Frage und mindestens 2 Antworten erforderlich.');
  }

  $settings = poll_manager_get_settings();
  $api_root = trim($settings['api_root']);
  $token = poll_manager_request_token();

  if (is_wp_error($token)) {
    wp_die('API Token Fehler: ' . $token->get_error_message());
  }

  $url = trailingslashit($api_root) . 'poll';
  $body = array(
    'question' => $question,
    'answers'  => $answers
  );

  $response = wp_remote_post($url, array(
    'headers' => array(
      'Authorization' => 'Bearer ' . $token,
      'Content-Type'  => 'application/json',
    ),
    'body' => wp_json_encode($body),
    'timeout' => 15
  ));

  if (is_wp_error($response)) {
    wp_die('API Request fehlgeschlagen: ' . $response->get_error_message());
  }

  $code = wp_remote_retrieve_response_code($response);
  if ($code === 200 || $code === 201) {
    // Success! Redirect back to main list
    wp_redirect(admin_url('admin.php?page=poll-manager&status=created'));
    exit;
  } else {
    $body = wp_remote_retrieve_body($response);
    wp_die('Fehler beim Erstellen: ' . esc_html($code) . ' - ' . esc_html($body));
  }
}

function poll_manager_request_token()
{
  $settings = poll_manager_get_settings();
  $api_root = trim($settings["api_root"]);

  if ($api_root === "") {
    return new WP_Error(
      "poll_manager_no_api_root",
      __("API Endpunkt ist nicht defienert", "poll-manager")
    );
  }

  $url = trailingslashit($api_root) . "login";
  $body = array(
    "password" => $settings["api_password"]
  );

  $response = wp_remote_post($url, array(
    "headers" => array(
      "Content-Type" => "application/json"
    ),
    "body" => wp_json_encode($body),
    "timeout" => 10
  ));

  if (is_wp_error($response)) {
    return $response; // network / HTTP-level problem
  }

  $code = wp_remote_retrieve_response_code($response);
  $raw  = wp_remote_retrieve_body($response);

  if ($code < 200 || $code >= 300) {
    return new WP_Error(
      'poll_manager_bad_status',
      sprintf('Unexpected status code %d', $code),
      array('body' => $raw)
    );
  }

  $data = json_decode($raw, true);
  if (!is_array($data) || empty($data['token'])) {
    return new WP_Error(
      'poll_manager_no_token',
      'Token not found in response.',
      array('body' => $raw)
    );
  }

  return $data['token'];
}

function poll_manager_get_polls()
{
  $settings = poll_manager_get_settings();
  $api_root = $settings["api_root"];

  if (empty($api_root)) {
    return array();
  }

  $token = poll_manager_request_token();

  if (is_wp_error($token)) {
    return array();
  }

  $url = trailingslashit($api_root) . "poll";

  $response = wp_remote_get($url, array(
    "timeout" => 15,
    "headers" => array(
      "Authorization" => "Bearer " . $token
    )
  ));

  if (is_wp_error($response)) {
    return array();
  }

  $code = wp_remote_retrieve_response_code($response);
  if ($code !== 200) {
    return array();
  }

  $body = wp_remote_retrieve_body($response);
  $data = json_decode($body, true);

  return is_array($data) ? $data : array();
}
// Main page content
function poll_manager_main_page()
{
  if (! current_user_can('manage_options')) {
    return;
  }
  $polls = poll_manager_get_polls();
?>
  <div class="wrap">
    <h1>Umfragen Übersicht</h1>
    <a href="<?php echo admin_url('admin.php?page=poll-manager-add'); ?>" class="page-title-action">Umfrage hinzufügen</a>


    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
      <?php wp_nonce_field('poll_manager_bulk_action', 'poll_manager_nonce'); ?>

      <input type="hidden" name="action" value="poll_manager_delete">
      <div class="tablenav top">
        <div class="alignleft actions bulkactions">
          <select name="bulk_action_selector">
            <option value="-1">Mehrfachaktionen</option>
            <option value="delete">Löschen</option>
          </select>
          <input type="submit" class="button action" value="Übernehmen">
        </div>
      </div>

      <table class="wp-list-table widefat fixed striped">
        <thead>
          <tr>
            <td id="cb" class="manage-column column-cb check-column">
              <input type="checkbox" id="cb-select-all">
            </td>
            <th>Titel</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($polls)): ?>
            <tr>
              <td colspan="4">Keine Umfragen gefunden.</td>
            </tr>
          <?php else: ?>
            <?php foreach ($polls as $poll): ?>
              <tr>
                <th scope="row" class="check-column">
                  <input type="checkbox"
                    name="poll_ids[]"
                    value="<?php echo esc_attr($poll['id']); ?>">
                </th>
                <td>
                  <strong><?php echo esc_html($poll['question']); ?></strong>
                </td>
                <td>
                  <a href="<?php echo esc_url(
                              admin_url('admin.php?page=poll-manager-edit&id=' . $poll['id'])
                            ); ?>">Bearbeiten</a>
                  |
                  <a href="<?php echo esc_url(
                              wp_nonce_url(
                                admin_url('admin-post.php?action=poll_manager_delete&id=' . $poll['id']),
                                'poll_manager_delete_' . $poll['id']
                              )
                            ); ?>" class="submitdelete">Löschen</a>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </form>
  </div>

  <script>
    // Basic "select all" behaviour
    document.addEventListener('DOMContentLoaded', function() {
      const master = document.getElementById('cb-select-all');
      if (!master) return;
      master.addEventListener('change', function() {
        document.querySelectorAll('tbody .check-column input[type="checkbox"]')
          .forEach(cb => cb.checked = master.checked);
      });
    });
  </script>
<?php
}

// Settings registration 
add_action('admin_init', 'poll_manager_register_settings');

function poll_manager_register_settings()
{
  register_setting(
    "poll_manager_settings_group", // Settings Group
    "poll_manager_settings"        // Settings Key
  );

  // Section (Visual Heading)
  add_settings_section(
    'poll_manager_server_section',
    'Servereinstellungen',
    'poll_manager_section_server_settings',   // Callback for description under text
    'poll-manager-settings'                   // Page slug
  );

  // Settings field: api_root
  add_settings_field(
    'poll_manager_api_root',
    'API Endpunkt Adresse',
    'poll_manager_api_root_field', // Callback function (HTML)
    'poll-manager-settings',
    'poll_manager_server_section'
  );

  // Settings field: api_password
  add_settings_field(
    "poll_manager_api_password",
    "API Passwort",
    "poll_manager_api_password_filed", // Callback function (HTML)
    "poll-manager-settings",
    "poll_manager_server_section"
  );
}

function poll_manager_section_server_settings()
{
  echo '<p>Servereinstellungen für den Umfragen-Manager.</p>';
}

function poll_manager_api_password_filed()
{

?>
  <input
    type="password"
    name="poll_manager_settings[api_password]"
    value=""
    class="regular-text">
  <p class="description">Das ist das Passwort das genutzt wird um sich bei der API zu authentifizieren. Lassen sie das feld leer um das alte passwort zu verwenden.</p>
<?php
}
function poll_manager_api_root_field()
{
  $options = get_option("poll_manager_settings");
  $value = isset($options["api_root"]) ? $options["api_root"] : "";
?>
  <input
    type="url"
    name="poll_manager_settings[api_root]"
    value="<?php echo esc_attr($value); ?>"
    class="regular-text">
  <p class="description">Diese URL sollte zum Endpunkt der API auf der gehostete smgnews instanz z.B.: https://www.smgnews.de/api</p>
<?php
}

// Edit page render
function poll_manager_render_edit_page()
{
  if (!current_user_can('manage_options')) return;

  $poll_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
  if (!$poll_id) {
    wp_die('Ungültige Umfrage-ID.');
  }

  $settings = poll_manager_get_settings();
  $api_root = trim($settings['api_root']);
  $token = poll_manager_request_token();

  $url = trailingslashit($api_root) . 'poll/' . $poll_id;
  $response = wp_remote_get($url, array(
    'headers' => array('Authorization' => 'Bearer ' . $token),
    'timeout' => 15
  ));

  if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
    wp_die('Fehler beim Laden der Umfrage (API Error).');
  }

  $raw_data = json_decode(wp_remote_retrieve_body($response), true);
  $poll = (isset($raw_data[0]) && is_array($raw_data[0])) ? $raw_data[0] : $raw_data;
  $current_question = isset($poll['question']) ? $poll['question'] : '';
  $current_answers_data = isset($poll['answers']) ? $poll['answers'] : array();
  $current_answers = array();

  foreach ($current_answers_data as $ans_obj) {
    if (isset($ans_obj['answer'])) {
      $current_answers[] = $ans_obj['answer'];
    }
  }

?>
  <div class="wrap">
    <h1>Umfrage bearbeiten</h1>

    <form action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post">
      <!-- Action hook for update -->
      <input type="hidden" name="action" value="poll_manager_update_poll">
      <input type="hidden" name="poll_id" value="<?php echo esc_attr($poll_id); ?>">
      <?php wp_nonce_field('poll_manager_edit_nonce_' . $poll_id, 'poll_nonce'); ?>

      <table class="form-table">
        <tr>
          <th scope="row"><label for="poll_question">Frage</label></th>
          <td>
            <input name="poll_question" type="text" id="poll_question"
              value="<?php echo esc_attr($current_question); ?>" class="regular-text" required>
          </td>
        </tr>
        <tr>
          <th scope="row">Antwortmöglichkeiten</th>
          <td>
            <div id="answers-wrapper">
              <?php foreach ($current_answers as $answer): ?>
                <div class="answer-row" style="margin-bottom: 10px;">
                  <input type="text" name="poll_answers[]"
                    value="<?php echo esc_attr($answer); ?>" class="regular-text" required>
                  <button type="button" class="button button-link-delete remove-answer" style="color: #b32d2e;">Entfernen</button>
                </div>
              <?php endforeach; ?>

              <!-- Fallback if no answers exist -->
              <?php if (empty($current_answers)): ?>
                <div class="answer-row" style="margin-bottom: 10px;">
                  <input type="text" name="poll_answers[]" class="regular-text" placeholder="Antwort 1" required>
                </div>
                <div class="answer-row" style="margin-bottom: 10px;">
                  <input type="text" name="poll_answers[]" class="regular-text" placeholder="Antwort 2" required>
                </div>
              <?php endif; ?>
            </div>
            <button type="button" class="button" id="add-answer-btn">Antwort hinzufügen</button>
          </td>
        </tr>
      </table>

      <?php submit_button('Änderungen speichern'); ?>
    </form>
  </div>

  <script>
    document.getElementById('add-answer-btn').addEventListener('click', function() {
      var wrapper = document.getElementById('answers-wrapper');
      var input = document.createElement('div');
      input.className = 'answer-row';
      input.style.marginBottom = '10px';
      input.innerHTML = '<input type="text" name="poll_answers[]" class="regular-text" placeholder="Weitere Antwort"> ' +
        '<button type="button" class="button button-link-delete remove-answer" style="color: #b32d2e;">Entfernen</button>';
      wrapper.appendChild(input);
    });

    document.getElementById('answers-wrapper').addEventListener('click', function(e) {
      if (e.target.classList.contains('remove-answer')) {
        e.target.parentElement.remove();
      }
    });
  </script>
<?php
}

// Add page render
function poll_manager_render_add_page()
{
  if (!current_user_can("manage_options")) return;
?>
  <div class="wrap">
    <h1>Neue Umfrage hinzufügen</h1>
    <form action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post">
      <!-- Action hook for processing -->
      <input type="hidden" name="action" value="poll_manager_create_poll">
      <?php wp_nonce_field('poll_manager_create_nonce', 'poll_nonce'); ?>

      <table class="form-table">
        <tr>
          <th scope="row"><label for="poll_question">Frage</label></th>
          <td>
            <input name="poll_question" type="text" id="poll_question" class="regular-text" required>
          </td>
        </tr>
        <tr>
          <th scope="row">Antwortmöglichkeiten</th>
          <td>
            <div id="answers-wrapper">
              <div class="answer-row" style="margin-bottom: 10px;">
                <input type="text" name="poll_answers[]" class="regular-text" placeholder="Antwort 1" required>
              </div>
              <div class="answer-row" style="margin-bottom: 10px;">
                <input type="text" name="poll_answers[]" class="regular-text" placeholder="Antwort 2" required>
              </div>
            </div>
            <button type="button" class="button" id="add-answer-btn">Antwort hinzufügen</button>
          </td>
        </tr>
      </table>

      <?php submit_button('Umfrage erstellen'); ?>
    </form>
  </div>

  <script>
    document.getElementById('add-answer-btn').addEventListener('click', function() {
      var wrapper = document.getElementById('answers-wrapper');
      var input = document.createElement('div');
      input.className = 'answer-row';
      input.style.marginBottom = '10px';
      input.innerHTML = '<input type="text" name="poll_answers[]" class="regular-text" placeholder="Weitere Antwort"> ' +
        '<button type="button" class="button button-link-delete remove-answer" style="color: #b32d2e;">Entfernen</button>';
      wrapper.appendChild(input);
    });

    // Event delegation for remove button
    document.getElementById('answers-wrapper').addEventListener('click', function(e) {
      if (e.target.classList.contains('remove-answer')) {
        e.target.parentElement.remove();
      }
    });
  </script>
  </div>
<?php
}

// Settings page render
function poll_manager_render_settings()
{
  if (! current_user_can('manage_options')) {
    return;
  }

?>
  <div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

    <form action="options.php" method="post">
      <?php
      settings_fields('poll_manager_settings_group');
      do_settings_sections('poll-manager-settings');
      submit_button();
      ?>
    </form>
  </div>
<?php
}
