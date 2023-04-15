import color from "./color";

declare const ace: AceType;

interface AceType {
  define(name: string, dependencies: string[], create: Function): void;
}

function createStyle(require: Function, exports: any): void {
  const style = `
    .ace_editor {
      min-width: 100%;
      min-height: 100%;

    }
    .ace_scroller {
      margin: 30px 0 0;
    }
    .ace_content {
      border-left: 2px solid ${color.black};
    }
    .ace_gutter {
      padding: 30px 0 0;
      color: ${color.lightGrey};
      background: ${color.codGrey};
    }
    .ace_gutter-cell {
      padding: 0 20px;
    }
    .ace_comment {
      color: ${color.lightGrey};
    }
    .ace_xml.ace_keyword {
      color: ${color.pink};
    }
    .ace_marker-layer .ace_selection {
      background: #475569;
    }
    .ace_active-line{
      background: ${color.charade}
    }
    .ace_type, .ace_keyword {
      color: ${color.lightGreen};
    }
    .ace_operator, .ace_punctuation {
      color: ${color.pink};
    }
    .ace_name, .ace_class, .ace_string, .ace_numeric, .ace_attribute-value {
      color: ${color.lightPurple};
    }
  `;

  exports.cssText = style;
  exports.cssClass = "ace_svg2jsx";

  require("../lib/dom").importCssString(style, "ace_svg2jsx");
}

ace.define(
  "ace/theme/customTheme",
  ["require", "exports", "module", "ace/lib/dom"],
  createStyle
);
