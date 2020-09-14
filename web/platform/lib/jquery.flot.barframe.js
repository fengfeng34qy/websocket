/* Flot plugin for plotting bars frame .

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

frame bars are used to show standard deviation and other statistical
properties in a plot.

* Created by Rui Pereira  -  rui (dot) pereira (at) gmail (dot) com

This plugin allows you to plot frame-bars over points. Set "framebars" inside
the points series to the axis name over which there will be frame values in
your data array (*even* if you do not intend to plot them later, by setting
"show: null" on xerr/yerr).

The plugin supports these options:

        series: {
            bars: {
                frames: {
                    show: false,
                    color: null,   // null = no fill
                    lineWidth:1,
                    shadow:{
                        show:false,// boolean or "long":long shadow
                        size:null,//null = auto,in units of the x axis
                        angle:45,
                        color:"rgba(200, 200, 200, 0.1)"
                    }
                },
                warnings: {
                    show: false,
                    color: "#f00",
                    lineWidth:0, // no border
                    fillColor: "#f00"
                }
            }
        }

*/

(function ($) {
    var options = {
        series: {
            bars: {
                frames: {
                    show: false,
                    color: null,
                    lineWidth:1,
                    shadow:{
                        show:false,// boolean or "long":long shadow
                        size:null,//null = auto
                        angle:45,
                        color:"rgba(200, 200, 200, 0.1)"
                    }
                },
                warnings: {
                    show: false,
                    color: "#f00",
                    lineWidth:0,
                    fillColor: "#f00"
                }
            }
        },
        statement:{
            show:false,
            height:30,
            xaxis:"",
            yaxis:""
        }
    };
    function processOffset(plot, offset) {
        var options = plot.getOptions();
        if (options.statement.show) {
            offset.top += options.statement.height;
        }
    }
    function processRawData(plot, series, data, datapoints){
        if (!series.bars.frames)
            return;

        // x,y values
        var format = [
            { x: true, number: true, required: true },
            { y: true, number: true, required: true },
            { y: true, number: true, required: true },  // bar bottom
            { y: true, number: true, required: false }   // warning
        ];

        datapoints.format = format;
        if(series.bars.frames.shadow.size == null)  {
            series.bars.frames.shadow.size = 1 - series.bars.barWidth;
        }
    }

    function drawBar(x, y, b, barLeft, barRight, fillStyleCallback, axisx, axisy, c, horizontal, lineWidth, shadow) {
        var left, right, bottom, top,
            drawLeft, drawRight, drawTop, drawBottom,
            tmp;

        // in horizontal mode, we start the bar from the left
        // instead of from the bottom so it appears to be
        // horizontal rather than vertical
        if (horizontal) {
            drawBottom = drawRight = drawTop = true;
            drawLeft = false;
            left = b;
            right = x;
            top = y + barLeft;
            bottom = y + barRight;

            // account for negative bars
            if (right < left) {
                tmp = right;
                right = left;
                left = tmp;
                drawLeft = true;
                drawRight = false;
            }
        }
        else {
            drawLeft = drawRight = drawTop = true;
            drawBottom = false;
            left = x + barLeft;
            right = x + barRight;
            bottom = b;
            top = y;

            // account for negative bars
            if (top < bottom) {
                tmp = top;
                top = bottom;
                bottom = tmp;
                drawBottom = true;
                drawTop = false;
            }
        }

        // clip
        if (right < axisx.min || left > axisx.max ||
            top < axisy.min || bottom > axisy.max)
            return;

        if (left < axisx.min) {
            left = axisx.min;
            drawLeft = false;
        }

        if (right > axisx.max) {
            right = axisx.max;
            drawRight = false;
        }

        if (bottom < axisy.min) {
            bottom = axisy.min;
            drawBottom = false;
        }

        if (top > axisy.max) {
            top = axisy.max;
            drawTop = false;
        }

        var gradient,sBottomright, sBottomleft,sangle,sTop,sSize
            ;
        // shadow
        if (shadow){
            sTop = axisy.max;
            sangle = shadow.angle % 90;
            sSize = shadow.size;
            if(right + sSize > axisx.max) sSize = axisx.max- right;
            if(shadow.show == "long") {
                c.save();
                // 数值和画布y周颠倒，axisy.max - sTop
                sBottomright = axisy.p2c(axisy.max - sTop) * Math.tan(Math.PI/180 * sangle);
                sBottomright = axisx.p2c(right) + sBottomright;
                /*
                gradient  =  c.createLinearGradient(axisx.p2c(left),axisy.p2c(sTop)
                    ,sBottomright,axisy.p2c(axisy.min));
                */
                gradient  =  c.createLinearGradient(axisx.p2c(left),axisy.p2c(sTop)
                    ,axisx.p2c(right + sSize),axisy.p2c(axisy.min));
                gradient.addColorStop(0, shadow.color);
                gradient.addColorStop(0.8, "rgba(0,0,0,0)");
                c.fillStyle = gradient;
                //clip
                c.beginPath();
                c.moveTo(axisx.p2c(left), axisy.p2c(axisy.min));
                c.lineTo(axisx.p2c(left), axisy.p2c(sTop));
                c.lineTo(axisx.p2c(right  + sSize), axisy.p2c(sTop));
                c.lineTo(axisx.p2c(right  + sSize), axisy.p2c(axisy.min));
                c.closePath();
                c.clip();
                c.beginPath();

                // shadow
                sBottomleft = axisy.p2c(axisy.max - bottom) * Math.tan(Math.PI/180 * sangle);
                sBottomleft = axisx.p2c(left) + sBottomleft;
                // left,bottom point
                c.moveTo(axisx.p2c(left), axisy.p2c(bottom));
                c.lineTo(axisx.p2c(right), axisy.p2c(bottom));
                c.lineTo(axisx.p2c(right), axisy.p2c(sTop));
                c.lineTo(sBottomright, axisy.p2c(axisy.min));
                c.lineTo(sBottomleft, axisy.p2c(axisy.min));
                c.closePath();
                c.fill();
                c.restore();

            }
            else {
                // todo: common shadow
            }
        }

        left = axisx.p2c(left);
        bottom = axisy.p2c(bottom);
        right = axisx.p2c(right);
        top = axisy.p2c(top);

        // 1 px bar
        if (right == left) right = right +1;
        if (top == bottom) bottom = bottom +1;

        // fill the bar
        if (fillStyleCallback) {
            c.fillStyle = fillStyleCallback(bottom, top);
            c.fillRect(left, top, right - left, bottom - top)
        }

        // draw outline
        if (lineWidth > 0 && (drawLeft || drawRight || drawTop || drawBottom)) {
            c.beginPath();

            // FIXME: inline moveTo is buggy with excanvas
            c.moveTo(left, bottom);
            if (drawLeft)
                c.lineTo(left, top);
            else
                c.moveTo(left, top);
            if (drawTop)
                c.lineTo(right, top);
            else
                c.moveTo(right, top);
            if (drawRight)
                c.lineTo(right, bottom);
            else
                c.moveTo(right, bottom);
            if (drawBottom)
                c.lineTo(left, bottom);
            else
                c.moveTo(left, bottom);
            c.stroke();
        }
    }

    function drawSeriesFrames(plot, ctx, series) {
        function plotBars(datapoints, barLeft, barRight, fillStyleCallback, axisx, axisy) {
            var points = datapoints.points, ps = datapoints.pointsize, i,
            lineWidth;

            if (series.bars.frames && series.bars.frames.show) {
                ctx.lineWidth = lineWidth = series.bars.frames.lineWidth != null? series.bars.frames.lineWidth : series.bars.lineWidth;
                ctx.strokeStyle = series.bars.frames.color != null ? series.bars.frames.color : series.color;

                for (i = 0; i < points.length; i += ps) {
                    if (points[i] == null)
                        continue;
                    drawBar(points[i], series.yaxis.max, points[i + 2], barLeft, barRight, fillStyleCallback, axisx, axisy, ctx, series.bars.horizontal, lineWidth, series.bars.frames.shadow);
                }
            }
            var top, bottom;
            // draw warings
            if (series.bars.warnings && series.bars.warnings.show) {

                ctx.lineWidth = lineWidth= series.bars.warnings.lineWidth != null? series.bars.warnings.lineWidth : series.bars.lineWidth;
                ctx.strokeStyle = series.bars.warnings.color;
                fillStyleCallback = function(top, bottom) {return series.bars.warnings.fillColor};
                for ( i = 0; i < points.length; i += ps) {
                    if (points[i] == null || !points[i + 3] )
                        continue;
                    if (points[i + 3] >= points[i + 1]) {
                        top = bottom = points[i + 3];
                    }
                    else {
                        top = points[i + 1];
                        bottom = points[i + 3];
                    }
                    drawBar(points[i], top, bottom, barLeft, barRight, fillStyleCallback, axisx, axisy, ctx, series.bars.horizontal, lineWidth);
                }
            }
        }

        var plotOffset = plot.getPlotOffset;
        ctx.save();
        ctx.translate(plotOffset.left, plotOffset.top);


        var barLeft;

        switch (series.bars.align) {
            case "left":
                barLeft = 0;
                break;
            case "right":
                barLeft = -series.bars.barWidth;
                break;
            default:
                barLeft = -series.bars.barWidth / 2;
        }

        var fillStyleCallback =  null;
        plotBars(series.datapoints, barLeft, barLeft + series.bars.barWidth, fillStyleCallback, series.xaxis, series.yaxis);
        ctx.restore();
    }

    function draw(plot, ctx){
        var plotOffset = plot.getPlotOffset();

        insertStatement(plot);

        ctx.save();
        ctx.translate(plotOffset.left, plotOffset.top);
        $.each(plot.getData(), function (i, s) {
                drawSeriesFrames(plot, ctx, s);
        });
        ctx.restore();
    }
    function insertStatement(plot) {
        var options = plot.getOptions();
        var placeholder = plot.getPlaceholder();

        if (options.statement.container != null) {
            $(options.statement.container).html("");
        } else {
            placeholder.find("#statement").remove();
        }

        if (!options.statement.show) {
            return;
        }


        // statement container
        // Generate markup for the list of entries, in their final order
        var $yaxis ,$xaxis ,$statement,$legend,s;

        s = options.statement;
        $statement = $("<div id='statement'></div>");
        $xaxis = $("<div id='stmtXaxis'></div>").appendTo($statement);
        $yaxis = $("<div id='stmtYaxis'></div>").appendTo($statement);
        $legend = $("<div id='stmtLegend'></div>").appendTo($statement);

        $statement.css({
            position: "absolute",
            top: s.top + "px",
            left: s.left + "px",
            width: "100%",
            height: s.height + "px",
            color: options.grid.color,
            "font-size":"smaller"       });
        if(s.yaxis) {
            $yaxis.css({position: "absolute",
                    bottom: "0px",
                    left: "0px",
                    "margin-bottom": "1em"
                });
            $yaxis.text(s.yaxis);
        };

        $legend.css({position: "absolute",
                bottom: "0px",
                right: "0px",
                "margin-bottom": "1em",
                "margin-right": plot.getPlotOffset().right + "px"
            });
        $legend.append("<div id='warnOverColor' style='float:left; display: inline-block; width: 20px; height: 0.5em;margin-top:0.25em;; background-color: " + options.series.bars.warnings.fillColor + ";'></div>");
        $legend.append("<div id='warnOverText' style='float:left; display: inline-block;margin: 0 1em 0 0.2em'>超出预警值</div>");
        $legend.append("<div id='warnLineColor' style='float:left; display: inline-block; width: 20px; height: 0px; margin-top:0.5em;border:1px solid " + options.series.bars.warnings.fillColor + ";'></div>");
        $legend.append("<div id='warnLineText' style='float:left; display: inline-block;margin: 0 0 0 0.2em'>预警值</div>");
        placeholder.append($statement);
    }


    function init(plot) {
        plot.hooks.processOffset.push(processOffset);
        plot.hooks.processRawData.push(processRawData);
        plot.hooks.draw.push(draw);
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'barframe',
        version: '1.0'
    });
})(jQuery);
