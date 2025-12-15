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

// Prevent direct access
if (! defined('ABSPATH')) exit;

require_once plugin_dir_path(__FILE__) . 'includes/helpers.php';

// Load Admin logic (only if in admin)
if (is_admin()) {
  require_once plugin_dir_path(__FILE__) . 'admin/menus.php';
  require_once plugin_dir_path(__FILE__) . 'admin/page-main.php';
  require_once plugin_dir_path(__FILE__) . 'admin/page-add.php';
  require_once plugin_dir_path(__FILE__) . 'admin/page-edit.php';
  require_once plugin_dir_path(__FILE__) . 'admin/page-settings.php';
}
