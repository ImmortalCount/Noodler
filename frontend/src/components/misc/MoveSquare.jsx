import React, { Component } from "react";
import Snap from "snapsvg-cjs";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

export default class MoveSquare extends Component {
  state = {};

  componentDidMount() {
    const s = Snap("#svg")
    var bigSquare = s.rect(100, 100, 200, 200);

    var topLeft = s.circle(100, 100, 7);
    var topRight = s.circle(300, 100, 7);
    var bottomRight = s.circle(300, 300, 7);
    var bottomLeft = s.circle(100, 300, 7);

    bigSquare.attr({
      fill: "#fff",
      stroke: "#000",
      strokeWidth: 5
    });

    var dragStart = function(x, y, e) {
      // Save some starting values
      this.ox = this[0].attr("x");
      this.oy = this[0].attr("y");
      this.ow = this[0].attr("width");
      this.oh = this[0].attr("height");

      this.dragging = true;
    };

    var dragMove = function(dx, dy, x, y, e) {
      // Inspect cursor to determine which resize/move process to use
      switch (this.attr("cursor")) {
        case "nw-resize":
          this[0].attr({
            x: e.offsetX,
            y: e.offsetY,
            width: this.ow - dx,
            height: this.oh - dy
          });

          this[1].attr({
            //topLeft nw
            cx: e.offsetX,
            cy: e.offsetY
          });

          this[2].attr({
            //topRight  ne
            cx: e.offsetX + (this.ow - dx),
            cy: e.offsetY
          });

          this[3].attr({
            //bottomRight   se
            cx: e.offsetX + (this.ow - dx),
            cy: e.offsetY + (this.oh - dy)
          });

          this[4].attr({
            //bottomLeft  sw
            cx: e.offsetX,
            cy: e.offsetY + (this.oh - dy)
          });
          break;

        case "ne-resize":
          this[0].attr({
            y: e.offsetY,
            width: e.offsetX - this.ox,
            height: this.oh - dy
          });

          this[1].attr({
            //topLeft nw
            cx: e.offsetX - this.ow - dx,
            cy: e.offsetY
          });

          this[2].attr({
            //topRight  ne
            cx: e.offsetX,
            cy: e.offsetY
          });

          this[3].attr({
            //bottomRight   se
            cx: e.offsetX,
            cy: e.offsetY + (this.oh - dy)
          });

          this[4].attr({
            //bottomLeft  sw
            cx: e.offsetX - this.ow - dx,
            cy: e.offsetY + (this.oh - dy)
          });
          break;

        case "se-resize":
          this[0].attr({
            width: e.offsetX - this.ox,
            height: e.offsetY - this.oy
          });

          this[1].attr(
            {
              //topLeft
              //no changes
            }
          );

          this[2].attr({
            //topRight
            cx: e.offsetX
          });

          this[3].attr({
            //bottomRight
            cx: e.offsetX,
            cy: e.offsetY
          });

          this[4].attr({
            //bottomLeft
            cy: e.offsetY
          });

          break;

        case "sw-resize":
          this[0].attr({
            x: e.offsetX,
            width: this.ow - dx,
            height: e.offsetY - this.oy
          });

          this[1].attr({
            cx: e.offsetX
          });

          this[3].attr({
            cy: e.offsetY
          });

          this[4].attr({
            //bottomLeft  works
            cx: e.offsetX,
            cy: e.offsetY
          });
          break;

        default:
          this[0].attr({
            x: e.offsetX - this.ow * 0.5,
            y: e.offsetY - this.oh * 0.5
          });

          this[1].attr({
            //topLeft
            cx: e.offsetX - this.ow * 0.5,
            cy: e.offsetY - this.oh * 0.5
          });

          this[2].attr({
            //topRight
            cx: e.offsetX + this.ow * 0.5,
            cy: e.offsetY - this.oh * 0.5
          });

          this[3].attr({
            //bottomRight
            cx: e.offsetX + this.ow * 0.5,
            cy: e.offsetY + this.oh * 0.5
          });

          this[4].attr({
            //bottomLeft
            cx: e.offsetX - this.ow * 0.5,
            cy: e.offsetY + this.oh * 0.5
          });
          break;
      }
    };

    var dragEnd = function() {
      this.dragging = false;
    };

    var changeCursor = function(e, mouseX, mouseY) {
      // Don't change cursor during a drag operation
      if (this.dragging === true) {
        return;
      }

      // X,Y Coordinates relative to shape's orgin
      var relativeX = mouseX  - this[0].attr("x");
      var relativeY = mouseY  - this[0].attr("y");

      var shapeWidth = this[0].attr("width");
      var shapeHeight = this[0].attr("height");

      var resizeBorder = 10;

      // Change cursor
      if (relativeX < resizeBorder && relativeY < resizeBorder) {
        this.attr("cursor", "nw-resize");
      } else if (
        relativeX > shapeWidth - resizeBorder &&
        relativeY < resizeBorder
      ) {
        this.attr("cursor", "ne-resize");
      } else if (
        relativeX > shapeWidth - resizeBorder &&
        relativeY > shapeHeight - resizeBorder
      ) {
        this.attr("cursor", "se-resize");
      } else if (
        relativeX < resizeBorder &&
        relativeY > shapeHeight - resizeBorder
      ) {
        this.attr("cursor", "sw-resize");
      } else {
        this.attr("cursor", "move");
      }
    };

    var dropTargetGroup = s.group(
      bigSquare,
      topLeft,
      topRight,
      bottomRight,
      bottomLeft
    );
    dropTargetGroup.mousemove(changeCursor);
    dropTargetGroup.drag(dragMove, dragStart, dragEnd);
  }

  render() {
    return (
      <div style={styles}>
        <svg
          id="svg"
          height="100vh"
          width="100wv"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        />
      </div>
    );
  }
}


