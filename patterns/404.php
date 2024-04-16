<?php
/**
 * Title: 404
 * Slug: twentytwentyfour/404
 * Categories: hidden
 * Inserter: no
 */
?>
<!-- wp:template-part {"slug":"header","tagName":"header","area":"header"} /-->

<!-- wp:group {"tagName":"main","style":{"spacing":{"margin":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50"},"blockGap":"var:preset|spacing|30"}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group" style="margin-top:var(--wp--preset--spacing--50);margin-bottom:var(--wp--preset--spacing--50)"><!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading" id="page-not-found"><?php echo __('Page Not Found', 'twentytwentyfour');?></h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><?php echo __('The page you are looking for does not exist, or it has been moved.', 'twentytwentyfour');?></p>
<!-- /wp:paragraph --></main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","tagName":"footer","area":"footer"} /-->