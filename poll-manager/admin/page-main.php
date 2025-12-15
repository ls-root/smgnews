<?php
if (! defined('ABSPATH')) exit;

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
