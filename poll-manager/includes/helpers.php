<?php
if (! defined('ABSPATH')) exit;

function poll_manager_get_settings()
{
  $defaults = array(
    "api_root" => "",
    "api_password" => ""
  );
  $options = get_option("poll_manager_settings", array());
  return wp_parse_args($options, $defaults);
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
