<?php

/**
 * DCPBK Twenty Twenty-Four functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package DCPBK Twenty Twenty-Four
 * @since DCPBK Twenty Twenty-Four 1.0
 */


if (!function_exists('dcpbktwentytwentyfour_return_custom_field')) {

    /**
     * Register shortcode to return custom field value
     * Usage: [metalookup field="custom_field_name" default="No data found"]
     *
     * @since DCPBK Twenty Twenty-Four 1.0
     * @param array $atts Shortcode attributes
     * @return string Custom field value or default value
     */
    function dcpbktwentytwentyfour_return_custom_field($atts)
    {
        $atts = shortcode_atts(array(
            'field' => '',
            'default' => 'No data found',
        ), $atts, 'metalookup');

        // Get the custom field value
        if ($custom_field = get_post_meta(get_the_ID(), $atts['field'], true)) {
            return $custom_field;
        } else {
            return $atts['default'];
        }
    }

    add_shortcode('metalookup', 'dcpbktwentytwentyfour_return_custom_field');
}

// Handle the blocks named "Forced Shortcode" (use this attribute inside query loops!)
// Usage example:
// <!-- wp:shortcode {"metadata":{"name":"Forced Shortcode"}} -->
// <div>[metalookup field="position" default="Board Member"]</div>
// <!-- /wp:shortcode -->
// Source: https://gist.github.com/frzsombor/c53446050ee0bb5017e29b9afb039309
add_filter('render_block', function ($block_content, $block, $instance) {
    if (isset($block['attrs']) && isset($block['attrs']['metadata']) && isset($block['attrs']['metadata']['name']) && $block['attrs']['metadata']['name'] === 'Forced Shortcode') {
        return do_shortcode($block_content);
    }
    return $block_content;
}, 10, 3);

// WP Total Cache: Set Cache-Control and Expires headers for HTML files
// Set Cache-Control and Expires to 1 hour
add_filter('wpsc_htaccess_mod_headers', function ($headers) {
    $headers['Cache-Control'] = 'max-age=3600, must-revalidate';
    return $headers;
}, 1);

add_filter('wpsc_htaccess_mod_expires', function ($expiry_rules) {
    $expiry_rules = array_filter($expiry_rules, function ($rule) {
        return strpos($rule, 'ExpiresByType') === false;
    });

    $expiry_rules[] = 'ExpiresByType text/html "access plus 1 hour"';
    return $expiry_rules;
}, 1);
