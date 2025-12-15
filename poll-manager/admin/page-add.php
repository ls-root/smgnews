<?php
if (! defined('ABSPATH')) exit;

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
