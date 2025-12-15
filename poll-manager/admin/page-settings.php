<?php
if (! defined('ABSPATH')) exit;

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
