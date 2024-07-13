/**
 * Add "Force Shortcodes" setting to specific blocks
 * by @frzsombor - 2024
 * https://gist.github.com/frzsombor/c53446050ee0bb5017e29b9afb039309
 */

(function () {
  /* Basic config */

  const attributeNS = "frzsombor/force-shortcodes"; // Namespace for JS filters
  const attributeName = "forceShortcodes"; // camelCasedName for storing data
  const attributeTitle = "Shortcode rendering method";
  const attributeLabel = "Force render shortcodes";

  /* Advanced config */

  // addInAdvancedControl (bool)
  // [true]  : Add to existing "Advanced" control block
  // [false] : Add as a standalone control block
  const addInAdvancedControl = true;

  // addToBlocks (bool|array)
  // [true]  : Add attribute to all blocks
  // [array] : Add attribute to blocks matching the categories in this array
  // [false] : Add attribute to blocks in addToCustomBlocks only
  const addToBlocks = ["text"];

  // addToCustomBlocks (array)
  // Array of full block names like ['core/heading', 'core/paragraph', etc.]
  // These are added along with the blocks defined by addToBlocks
  const addToCustomBlocks = ["core/shortcode"];

  /* Initialization */

  const { addFilter } = wp.hooks;
  const { createElement, Fragment } = wp.element;
  const { createHigherOrderComponent } = wp.compose;

  /* Register the custom attribute for required blocks */

  function addCustomAttribute(settings, name) {
    const hasAttributes = typeof settings.attributes !== "undefined";
    const includeAll = addToBlocks === true;
    const matchesCategory = Array.isArray(addToBlocks)
      ? addToBlocks.includes(settings.category)
      : addToBlocks;
    const inCustomList = addToCustomBlocks.includes(name);

    if (hasAttributes && (includeAll || matchesCategory || inCustomList)) {
      settings.attributes[attributeName] = {
        type: "boolean",
        default: false,
      };
    }
    return settings;
  }

  addFilter("blocks.registerBlockType", attributeNS, addCustomAttribute);

  /* Add custom control to the block settings sidebar */

  const { InspectorControls } = wp.blockEditor; // For standalone control
  const { InspectorAdvancedControls } = wp.blockEditor; // For adding to Advanced control
  const { PanelBody, CheckboxControl } = wp.components;
  const { withSelect, withDispatch } = wp.data;
  const { compose } = wp.compose;

  const CustomAttributeControl = compose(
    withSelect((select) => {
      return {
        selectedBlock: select("core/block-editor").getSelectedBlock(),
      };
    }),
    withDispatch((dispatch) => {
      return {
        updateBlockAttributes:
          dispatch("core/block-editor").updateBlockAttributes,
      };
    })
  )(({ selectedBlock, updateBlockAttributes }) => {
    // If there is no selectedBlock or block doesn't have the custom attribute defined
    if (
      !selectedBlock ||
      typeof selectedBlock.attributes[attributeName] === "undefined"
    ) {
      return null;
    }

    const attributeValue = selectedBlock.attributes[attributeName] || false;

    if (addInAdvancedControl) {
      // Add to Advanced control block
      return createElement(
        InspectorAdvancedControls,
        null,
        createElement(CheckboxControl, {
          help: attributeTitle,
          label: attributeLabel,
          checked: attributeValue,
          onChange: (value) =>
            updateBlockAttributes(selectedBlock.clientId, {
              [attributeName]: value,
            }),
        })
      );
    } else {
      // Add as a standalone control block
      return createElement(
        InspectorControls,
        null,
        createElement(
          PanelBody,
          { title: attributeTitle, initialOpen: true },
          createElement(CheckboxControl, {
            label: attributeLabel,
            checked: attributeValue,
            onChange: (value) =>
              updateBlockAttributes(selectedBlock.clientId, {
                [attributeName]: value,
              }),
          })
        )
      );
    }
  });

  const withInspectorControl = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
      return createElement(
        Fragment,
        null,
        createElement(BlockEdit, props),
        createElement(CustomAttributeControl, {
          ...props,
        })
      );
    };
  }, "withInspectorControl");

  addFilter(
    "editor.BlockEdit",
    attributeNS.replace("/", "/with-") + "-inspector-control",
    withInspectorControl
  );

  /* Ensure attribute value is saved and rendered */

  const withCustomAttributeSave = createHigherOrderComponent(
    (BlockListBlock) => {
      return (props) => {
        return createElement(BlockListBlock, props);
      };
    },
    "withCustomAttributeSave"
  );

  addFilter(
    "editor.BlockListBlock",
    attributeNS.replace("/", "/with-") + "-save",
    withCustomAttributeSave
  );

  function addCustomAttributeSave(element, blockType, attributes) {
    if (attributes[attributeName]) {
      element.props[attributeName] = attributes[attributeName];
    }
    return element;
  }

  addFilter(
    "blocks.getSaveElement",
    attributeNS + "-save",
    addCustomAttributeSave
  );
})();
