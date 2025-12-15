<?php
if (! defined('ABSPATH')) exit;

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
