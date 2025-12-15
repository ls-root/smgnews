<?php
if (! defined('ABSPATH')) exit;

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
