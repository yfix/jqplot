/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: @VERSION
 * Revision: @REVISION
 *
 * Copyright (c) 2009-2012 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    /**
     * Class: $.jqplot.MeritOrderRenderer
     * Draw a merit order ranking chart.
     * 
     * Takes a set of series, one series per bar, and draws bar scaled
     * proportionally scaled on the x and y axis in ascending order.
     * 
     * Data should look like:
     * 
     * > bar1 = [[x (width) value, y (height) value]];
     * > bar2 = [[x (width) value, y (height) value]];
     * > bar3 = [[x (width) value, y (height) value]];
     * 
     */
    
    
    $.jqplot.MeritOrderRenderer = function(){
        this.shapeRenderer = new $.jqplot.ShapeRenderer();
        // prop: borderColor
        // color of the borders between areas on the chart
        this.borderColor = null;
        // prop: showBorders
        // True to draw borders lines between areas on the chart.
        // False will draw borders lines with the same color as the area.
        this.showBorders = true;
    };
    
    // called with scope of series.
    $.jqplot.MeritOrderRenderer.prototype.init = function(options, plot) {
        this.fill = false;
        this.fillRect = true;
        this.strokeRect = true;
        this.shadow = false;
        // width of bar on x axis.
        this._xwidth = 0;
        this._xstart = 0;
        $.extend(true, this.renderer, options);
        // set the shape renderer options
        var opts = {lineJoin:'miter', lineCap:'butt', isarc:false, fillRect:this.fillRect, strokeRect:this.strokeRect};
        this.renderer.shapeRenderer.init(opts);
        plot.axes.x2axis._series.push(this);
        this._type = 'mekko';
    };
    
    // Method: setGridData
    // converts the user data values to grid coordinates and stores them
    // in the gridData array.  Will convert user data into appropriate
    // rectangles.
    // Called with scope of a series.
    $.jqplot.MeritOrderRenderer.prototype.setGridData = function(plot) {
        // recalculate the grid data
        var xp = this._xaxis.series_u2p;
        var yp = this._yaxis.series_u2p;
        var data = this._plotData;
        this.gridData = [];
        // figure out width on x axis.
        // this._xwidth = this._sumy / plot._sumy * this.canvas.getWidth();
        this._xwidth = xp(this._sumy) - xp(0);
        if (this.index>0) {
            this._xstart = plot.series[this.index-1]._xstart + plot.series[this.index-1]._xwidth;
        }
        var totheight = this.canvas.getHeight();
        var sumy = 0;
        var cury;
        var curheight;
        for (var i=0; i<data.length; i++) {
            if (data[i] != null) {
                sumy += data[i][1];
                cury = totheight - (sumy / this._sumy * totheight);
                curheight = data[i][1] / this._sumy * totheight;
                this.gridData.push([this._xstart, cury, this._xwidth, curheight]);
            }
        }
    };
    
    // Method: makeGridData
    // converts any arbitrary data values to grid coordinates and
    // returns them.  This method exists so that plugins can use a series'
    // linerenderer to generate grid data points without overwriting the
    // grid data associated with that series.
    // Called with scope of a series.
    $.jqplot.MeritOrderRenderer.prototype.makeGridData = function(data, plot) {
        // recalculate the grid data
        // figure out width on x axis.
        var xp = this._xaxis.series_u2p;
        var totheight = this.canvas.getHeight();
        var sumy = 0;
        var cury;
        var curheight;
        var gd = [];
        for (var i=0; i<data.length; i++) {
            if (data[i] != null) {
                sumy += data[i][1];
                cury = totheight - (sumy / this._sumy * totheight);
                curheight = data[i][1] / this._sumy * totheight;
                gd.push([this._xstart, cury, this._xwidth, curheight]);
            }
        }
        return gd;
    };
    

    // called within scope of series.
    $.jqplot.MeritOrderRenderer.prototype.draw = function(ctx, gd, options) {
        var i;
        var opts = (options != undefined) ? options : {};
        var showLine = (opts.showLine != undefined) ? opts.showLine : this.showLine;
        var colorGenerator = new $.jqplot.ColorGenerator(this.seriesColors);
        ctx.save();
        if (gd.length) {
            if (showLine) {
                for (i=0; i<gd.length; i++){
                    opts.fillStyle = colorGenerator.next();
                    if (this.renderer.showBorders) {
                        opts.strokeStyle = this.renderer.borderColor;
                    }
                    else {
                        opts.strokeStyle = opts.fillStyle;
                    }
                    this.renderer.shapeRenderer.draw(ctx, gd[i], opts);
                }
            }
        }
        
        ctx.restore();
    };  
    
    $.jqplot.MeritOrderRenderer.prototype.drawShadow = function(ctx, gd, options) {
        // This is a no-op, no shadows on mekko charts.
    };
    
    // setup default renderers for axes and legend so user doesn't have to
    // called with scope of plot
    function preInit(target, data, options) {
        options = options || {};
        options.axesDefaults = options.axesDefaults || {};
        options.legend = options.legend || {};
        options.seriesDefaults = options.seriesDefaults || {};
        var setopts = false;
        if (options.seriesDefaults.renderer == $.jqplot.MeritOrderRenderer) {
            setopts = true;
        }
        else if (options.series) {
            for (var i=0; i < options.series.length; i++) {
                if (options.series[i].renderer == $.jqplot.MeritOrderRenderer) {
                    setopts = true;
                }
            }
        }
        
        if (setopts) {
            options.axesDefaults.renderer = $.jqplot.MekkoAxisRenderer;
            options.legend.renderer = $.jqplot.MekkoLegendRenderer;
            options.legend.preDraw = true;
        }
    }
    
    $.jqplot.preInitHooks.push(preInit);
    
})(jQuery);    