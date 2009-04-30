/* *
* Title: jqPlot Graphs
* 
* Pure JavaScript plotting library for jQuery.
* 
* About: Version
*
* @VERSION 
* 
* About: Copyright
* 
* Copyright (c) 2009 Chris Leonello
* 
* About: License
* 
* Licensed under the MIT License.
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
* 
* About: Introduction
* 
* jqPlot can be customized by overriding the defaults of any of the objects which make
* up the plot.  The general usage of jqplot is:
* 
* > chart = $.jqplot('targetElemId', [dataArray,...], {optionsObject});
* 
* The optionsObject corresponds to an properties on a <jqPlot> instance, so customization
* may look like this:
* 
* > chart = $.jqplot('targetElemId', [dataArray, ...], {title:'My Plot', axes:{xaxis:{min:0, max:10}}});
*
* For more inforrmation, see <jqPlot Usage>.
*
* About: Usage
*
* See <jqPlot Usage>
* 
* */

(function($) {
    // Class: $.jqplot
    // jQuery function called by the user to create a plot.
    //
    // Parameters:
    // target - ID of target element to render the plot into.
    // data - an array of data series.
    // options - user defined options object.  See the individual classes for available options.
    $.jqplot = function(target, data, options) {
        var _data, _options;
        
        // check to see if only 2 arguments were specified, what is what.
        if (data == null) throw "No data specified";
        if (data.constructor == Array && data.length == 0 || data[0].constructor != Array) throw "Improper Data Array";
        if (options == null) {
            if (data instanceof Array) {
                _data = data;
                _options = null;   
            }
            
            else if (data.constructor == Object) {
                _data = null;
                _options = data;
            }
        }
        else {
            _data = data;
            _options = options;
        }
        var plot = new jqPlot();
        plot.init(target, _data, _options);
        plot.draw();
        return plot;
    };
    
    $.jqplot.debug = 1;
    
    // path to jqplot install, relative to the script that is including jqplot.
    $.jqplot.installPath = 'jqplot';
    $.jqplot.pluginsPath = 'jqplot/plugins';
    
    $.jqplot.preInitHooks = [];
    $.jqplot.postInitHooks = [];
    $.jqplot.preParseOptionsHooks = [];
    $.jqplot.postParseOptionsHooks = [];
    $.jqplot.preDrawHooks = [];
    $.jqplot.postDrawHooks = [];
    $.jqplot.preDrawSeriesHooks = [];
    $.jqplot.postDrawSeriesHooks = [];
    $.jqplot.drawLegendHooks = [];
    $.jqplot.preSeriesInitHooks = [];
    $.jqplot.postSeriesInitHooks = [];
    $.jqplot.preParseSeriesOptionsHooks = [];
    $.jqplot.postParseSeriesOptionsHooks = [];
    $.jqplot.eventListenerHooks = [];

    // A superclass holding some common properties and methods.
    $.jqplot.ElemContainer = function() {
        this._elem;
        this._plotWidth;
        this._plotHeight;
        this._plotDimensions = {height:null, width:null};
    };
    
    $.jqplot.ElemContainer.prototype.getWidth = function() {
        return this._elem.outerWidth(true);
    };
    
    $.jqplot.ElemContainer.prototype.getHeight = function() {
        return this._elem.outerHeight(true);
    };
    
    $.jqplot.ElemContainer.prototype.getPosition = function() {
        return this._elem.position();
    };
    
    $.jqplot.ElemContainer.prototype.getTop = function() {
        return this.getPosition().top;
    };
    
    $.jqplot.ElemContainer.prototype.getLeft = function() {
        return this.getPosition().left;
    };
    
    $.jqplot.ElemContainer.prototype.getBottom = function() {
        return this._elem.css('bottom');
    };
    
    $.jqplot.ElemContainer.prototype.getRight = function() {
        return this._elem.css('right');
    };
    

    // Class: Axis
    // An individual axis object.  Cannot be instantiated directly, but created
    // by the Plot oject.  Axis properties can be set or overriden by the 
    // options passed in from the user.
    // 
    // Parameters:
    //     name - Axis name (identifier).  One of 'xaxis', 'yaxis', 'x2axis' or 'y2axis'.
    function Axis(name) {
        $.jqplot.ElemContainer.call(this);
        // Group: Properties
        
        // prop: name
        // Axis name (identifier).  One of 'xaxis', 'yaxis', 'x2axis' or 'y2axis'.
        this.name = name;
        this._series = [];
        // prop: show
        // Wether to display the axis on the graph.
        this.show = false;
        // prop: min
        // minimum value of the axis (in data units, not pixels).
        this.min=null;
        // prop: max
        // maximum value of the axis (in data units, not pixels).
        this.max=null;
        // prop: pad
        // Padding to extend the range above and below the data bounds.
        // Factor to multiply by the data range when setting the axis bounds
        this.pad = 1.2;
        // prop: ticks
        // 1D [val, val, ...] or 2D [[val, label], [val, label], ...] array of ticks for the axis.
        // If no label is specified, the value is formatted into an appropriate label.
        this.ticks = [];
        // prop: numberTicks
        // Desired number of ticks.  Default is to compute automatically.
        this.numberTicks;
        // prop: tickInterval
        // number of units between ticks.  Mutually exclusive with numberTicks.
        this.tickInterval;
        // prop: renderer
        // A class of a rendering engine that handles tick generation, 
        // scaling input data to pixel grid units and drawing the axis element.
        this.renderer = $.jqplot.LinearAxisRenderer;
        // prop: rendererOptions
        // renderer specific options.  Not commonly used.
        this.rendererOptions = {};
        // prop: tickRenderer
        // A class of a rendering engine for creating the ticks labels displayed on the plot, 
        // See <$.jqplot.AxisTickRenderer>.
        this.tickRenderer = $.jqplot.AxisTickRenderer;
        // prop: tickOptions
        // Options that will be passed to the tickRenderer, see <$.jqplot.AxisTickRenderer> options.
        this.tickOptions = {};
        // prop: showTicks
        // wether to show the ticks (both marks and labels) or not.
        this.showTicks = true;
        // prop: showTickMarks
        // wether to show the tick marks (line crossing grid) or not.
        this.showTickMarks = true;
        // prop: showMinorTicks
        // Wether or not to show minor ticks.  This is renderer dependent.
        // The default <$.jqplot.LinearAxisRenderer> does not have minor ticks.
        this.showMinorTicks = true;
        // minimum and maximum values on the axis.
        this._dataBounds = {min:null, max:null};
        // pixel position from the top left of the min value and max value on the axis.
        this._offsets = {min:null, max:null};

        this._plotWidth;
        this._plotHeight;
        this._ticks=[];
    };
    
    Axis.prototype = new $.jqplot.ElemContainer();
    Axis.prototype.constructor = Axis;
    
    Axis.prototype.init = function() {
        this.renderer = new this.renderer();
        this.renderer.init.call(this, this.rendererOptions);
        
    };
    
    Axis.prototype.draw = function() {
        return this.renderer.draw.call(this);
    };
    
    Axis.prototype.set = function() {
        this.renderer.set.call(this);
    };
    
    Axis.prototype.pack = function(pos, offsets) {
        if (this.show) this.renderer.pack.call(this, pos, offsets);
    };

    // Class: Legend
    // Legend object.  Cannot be instantiated directly, but created
    // by the Plot oject.  Legend properties can be set or overriden by the 
    // options passed in from the user.
    function Legend() {
        $.jqplot.ElemContainer.call(this);
        // Group: Properties
        
        // prop: show
        // Wether to display the legend on the graph.
        this.show = false;
        // prop: location
        // Placement of the legend.  one of the compass directions: nw, n, ne, e, se, s, sw, w
        this.location = 'ne';
        // prop: xoffset
        // offset from the inside edge of the plot in the x direction in pixels.
        this.xoffset = 12;
        // prop: yoffset
        // offset from the inside edge of the plot in the y direction in pixels.
        this.yoffset = 12;
        // prop: border
        // css spec for the border around the legend box.
        this.border = '1px solid #cccccc';
        // prop: background
        // css spec for the background of the legend box.
        this.background = 'rgba(255,255,255,0.6)';
        // prop: textColor
        // css color spec for the legend text.
        this.textColor = '';
        // prop: fontFamily
        // css font-family spec for the legend text.
        this.fontFamily = ''; 
        // prop: fontSize
        // css font-size spec for the legend text.
        this.fontSize = '0.75em';
        // prop: rowSpacing
        // css padding-top spec for the rows in the legend.
        this.rowSpacing = '0.5em';
        // renderer
        // A class that will create a DOM object for the legend,
        // see <$.jqplot.TableLegendRenderer>.
        this.renderer = $.jqplot.TableLegendRenderer;
        // prop: rendererOptions
        // renderer specific options passed to the renderer.
        this.rendererOptions = {};
        this._series = [];
        
    };
    
    Legend.prototype = new $.jqplot.ElemContainer();
    Legend.prototype.constructor = Legend;
    
    Legend.prototype.init = function() {
        this.renderer = new this.renderer();
        this.renderer.init.call(this, this.rendererOptions);
    }
    
    Legend.prototype.draw = function(offsets) {
        return this.renderer.draw.call(this, offsets);
    };
    
    Legend.prototype.pack = function(offsets) {
        this.renderer.pack.call(this, offsets);
    };
    
    $.jqplot.TableLegendRenderer = function(){
        //
    };

    // Class: Title
    // Plot Title object.  Cannot be instantiated directly, but created
    // by the Plot oject.  Title properties can be set or overriden by the 
    // options passed in from the user.
    // 
    // Parameters:
    //     text - text of the title.
    function Title(text) {
        $.jqplot.ElemContainer.call(this);
        // Group: Properties
        
        // prop: text
        // text of the title;
        this.text = text;
        // prop: show
        // wether or not to show the title
        this.show = true;
        // prop: fontFamily
        // css font-family spec for the text.
        this.fontFamily = '';
        // prop: fontSize
        // css font-size spec for the text.
        this.fontSize = '1.2em';
        // prop: textAlign
        // css text-align spec for the text.
        this.textAlign = 'center';
        // prop: textColor
        // css color spec for the text.
        this.textColor = '';
        // prop: renderer
        // A class for creating a DOM element for the title,
        // see <$.jqplot.DivTitleRenderer>.
        this.renderer = $.jqplot.DivTitleRenderer;
        // prop: rendererOptions
        // renderer specific options passed to the renderer.
        this.rendererOptions = {};   
    };
    
    Title.prototype = new $.jqplot.ElemContainer();
    Title.prototype.constructor = Title;
    
    Title.prototype.init = function() {
        this.renderer = new this.renderer();
        this.renderer.init.call(this, this.rendererOptions);
    }
    
    Title.prototype.draw = function(width) {
        return this.renderer.draw.call(this, width);
    };
    
    Title.prototype.pack = function() {
        this.renderer.pack.call(this);
    };


    // Class: Series
    // An individual data series object.  Cannot be instantiated directly, but created
    // by the Plot oject.  Series properties can be set or overriden by the 
    // options passed in from the user.
    function Series() {
        $.jqplot.ElemContainer.call(this);
        // Group: Properties
        
        // prop: show
        // wether or not to draw the series.
        this.show = true;
        // prop: xaxis
        // name of x axis to associate with this series, either 'xaxis' or 'x2axis'.
        this.xaxis = 'xaxis';
        this._xaxis;
        // prop: yaxis
        // name of y axis to associate with this series, either 'yaxis' or 'y2axis'.
        this.yaxis = 'yaxis';
        this._yaxis;
        // prop: renderer
        // A class of a renderer which will draw the series, 
        // see <$.jqplot.LineRenderer>.
        this.renderer = $.jqplot.LineRenderer;
        // prop: rendererOptions
        // Options to pass on to the renderer.
        this.rendererOptions = {};
        // prop: data
        // data points for the line in series units.
        // converted to an array of (x,y) data points with x starting at 1 if a 1D array of y values is passed in.
        this.data = [];
        // prop: gridData
        // data points for the line in grid pixel units.
        this.gridData = [];
        // prop: label
        // Line label to use in the legend.
        this.label = '';
        // prop: color
        // css color spec for the series
        this.color;
        // prop: lineWidth
        // width of the line in pixels.  May have different meanings depending on renderer.
        this.lineWidth = 2.5;
        // prop: shadow
        // wether or not to draw a shadow on the line
        this.shadow = true;
        // prop: shadowAngle
        // Shadow angle in degrees
        this.shadowAngle = 45;
        // prop: shadowOffset
        // Shadow offset from line in pixels
        this.shadowOffset = 1;
        // prop: shadowDepth
        // Number of times shadow is stroked, each stroke offset shadowOffset from the last.
        this.shadowDepth = 3;
        // prop: shadowAlpha
        // Alpha channel transparency of shadow.  0 = transparent.
        this.shadowAlpha = '0.07';
        // prop: breakOnNull
        // wether line segments should be be broken at null value.
        // False will join point on either side of line.
        this.breakOnNull = false;
        // prop: markerRenderer
        // A class of a renderer which will draw marker (e.g. circle, square, ...) at the data points,
        // see <$.jqplot.MarkerRenderer>.
        this.markerRenderer = $.jqplot.MarkerRenderer;
        // prop: markerOptions
        // renderer specific options to pass to the markerRenderer,
        // see <$.jqplot.MarkerRenderer>.
        this.markerOptions = {};
        // prop: showLine
        // wether to actually draw the line or not.  Series will still be renderered, even if no line is drawn.
        this.showLine = true;
        // prop: showMarker
        // wether or not to show the markers at the data points.
        this.showMarker = true;
        
    };
    
    Series.prototype = new $.jqplot.ElemContainer();
    Series.prototype.constructor = Series;
    
    Series.prototype.init = function() {
        // weed out any null values in the data.
        var d = this.data;
        for (i=0; i<d.length; i++) {
            if (d[i] == null || d[i][0] == null || d[i][1] == null) {
                // For the time being, just delete null values
                // could keep them if wanted to break lines on null.
                d.splice(i,1);
                continue;
            }
        }
        this.renderer = new this.renderer();
        this.renderer.init.call(this, this.rendererOptions);
        this.markerRenderer = new this.markerRenderer();
        if (!this.markerOptions.color) this.markerOptions.color = this.color;
        if (this.markerOptions.show == null) this.markerOptions.show = this.showMarker;
        // the markerRenderer is called within it's own scaope, don't want to overwrite series options!!
        this.markerRenderer.init(this.markerOptions);
    }
    
    Series.prototype.draw = function(sctx) {
        for (var j=0; j<$.jqplot.preDrawSeriesHooks.length; j++) {
            $.jqplot.preDrawSeriesHooks[j].call(this.series[i], sctx);
        }
        this.renderer.setGridData.call(this);
        this.renderer.draw.call(this, sctx);
        for (var j=0; j<$.jqplot.postDrawSeriesHooks.length; j++) {
            $.jqplot.postDrawSeriesHooks[j].call(this.series[i], sctx);
        }
    }
    

    /* 
        Class: Grid
        
        Object representing the grid on which the plot is drawn.  The grid in this
        context is the area bounded by the axes, the area which will contain the series.
        Note, the series are drawn on their own canvas.
        The Grid object cannot be instantiated directly, but is created by the Plot oject.  
        Grid properties can be set or overriden by the options passed in from the user.
    */
    function Grid() {
        $.jqplot.ElemContainer.call(this);
        // Group: Properties
        
        // prop: drawGridlines
        // wether to draw the gridlines on the plot.
        this.drawGridlines = true;
        // prop: background
        // css spec for the background color.
        this.background = '#fffdf6';
        // prop: borderColor
        // css spec for the color of the grid border.
        this.borderColor = '#999999';
        // prop: borderWidth
        // width of the border in pixels.
        this.borderWidth = 2.0;
        // prop: shadow
        // wether to show a shadow behind the grid.
        this.shadow = true;
        // prop: shadowAngle
        // shadow angle in degrees
        this.shadowAngle = 45;
        // prop: shadowOffset
        // Offset of each shadow stroke from the border in pixels
        this.shadowOffset = 1.5;
        // prop: shadowWidth
        // width of the stoke for the shadow
        this.shadowWidth = 3;
        // prop: shadowDepth
        // Number of times shadow is stroked, each stroke offset shadowOffset from the last.
        this.shadowDepth = 3;
        // prop: shadowAlpha
        // Alpha channel transparency of shadow.  0 = transparent.
        this.shadowAlpha = '0.07';
        this._left;
        this._top;
        this._right;
        this._bottom;
        this._width;
        this._height;
        this._axes = [];
        // prop: renderer
        // Instance of a renderer which will actually render the grid,
        // see <$.jqplot.CanvasGridRenderer>.
        this.renderer = $.jqplot.CanvasGridRenderer;
        // prop: rendererOptions
        // Options to pass on to the renderer,
        // see <$.jqplot.CanvasGridRenderer>.
        this.rendererOptions = {};
        this._offsets = {top:null, bottom:null, left:null, right:null};
    };
    
    Grid.prototype = new $.jqplot.ElemContainer();
    Grid.prototype.constructor = Grid;
    
    Grid.prototype.init = function() {
        this.renderer = new this.renderer();
        this.renderer.init.call(this, this.rendererOptions);
    }
    
    Grid.prototype.createElement = function(offsets) {
        this._offsets = offsets;
        return this.renderer.createElement.call(this);
    }
    
    Grid.prototype.draw = function() {
        this.renderer.draw.call(this);
    }

    // Canvas for drawing series.
    // Sized to fit within the grid region.
    function SeriesCanvas() {
        $.jqplot.ElemContainer.call(this);
        this._ctx;
    };
    
    SeriesCanvas.prototype = new $.jqplot.ElemContainer();
    SeriesCanvas.prototype.constructor = SeriesCanvas;
    
    SeriesCanvas.prototype.createElement = function(offsets) {
        this._offsets = offsets;
        var elem = document.createElement('canvas');
        var w = this._plotDimensions.width - this._offsets.left - this._offsets.right;
        var h = this._plotDimensions.height - this._offsets.top - this._offsets.bottom;
        elem.width = this._plotDimensions.width - this._offsets.left - this._offsets.right;
        elem.height = this._plotDimensions.height - this._offsets.top - this._offsets.bottom;
        if ($.browser.msie) // excanvas hack
            elem = window.G_vmlCanvasManager.initElement(elem);
        this._elem = $(elem);
        this._elem.css({ position: 'absolute', left: this._offsets.left, top: this._offsets.top });
        return this._elem;
    };
    
    SeriesCanvas.prototype.setContext = function() {
        this._ctx = this._elem.get(0).getContext("2d");
        return this._ctx;
    }
    
    // Canvas for drawing effects over the grid and series.
    // Sized to fit within the grid region.
    function OverlayCanvas() {
        $.jqplot.ElemContainer.call(this);
        this._ctx;
    };
    
    OverlayCanvas.prototype = new $.jqplot.ElemContainer();
    OverlayCanvas.prototype.constructor = OverlayCanvas;
    
    OverlayCanvas.prototype.createElement = function(offsets) {
        this._offsets = offsets;
        var elem = document.createElement('canvas');
        var w = this._plotDimensions.width - this._offsets.left - this._offsets.right;
        var h = this._plotDimensions.height - this._offsets.top - this._offsets.bottom;
        elem.width = this._plotDimensions.width - this._offsets.left - this._offsets.right;
        elem.height = this._plotDimensions.height - this._offsets.top - this._offsets.bottom;
        if ($.browser.msie) // excanvas hack
            elem = window.G_vmlCanvasManager.initElement(elem);
        this._elem = $(elem);
        this._elem.css({ position: 'absolute', left: this._offsets.left, top: this._offsets.top });
        return this._elem;
    };
    
    OverlayCanvas.prototype.setContext = function() {
        this._ctx = this._elem.get(0).getContext("2d");
        return this._ctx;
    }

    // Class: jqPlot
    // Plot object returned to call to $.jqplot.  Handles parsing user options,
    // creating sub objects (Axes, legend, title, series) and rendering the plot.
    function jqPlot() {
        // Group: Properties
        
        // prop: data
        // user's data.  Should be in the form of
        // [ [[x1, y1], [x2, y2],...], [[x1, y1], [x2, y2], ...] ] or can be supplied in the series option like:
        // [{ data:[[x1, y1], [x2, y2],...], other_options...}, { data:[[x1, y1], [x2, y2],...], other_options...} ]
        this.data = [];
        // The id of the dom element to render the plot into
        this.targetId = null;
        // the jquery object for the dom target.
        this.target = null; 
        // prop: default
        // Default options.  Any of these can be specified individually and be applied
        // to all objects of the type.  A quick way to override all axes or series options.   
        // 
        // Properties
        // axesDefaults - defaults applied to all axes.
        // axes - axis by axis defaults.  Include all 4 axes, even if they are empty.
        // seriesDefaults - deraults applied to all series.
        // gridPadding - default padding around the grid drawing area if no axis or title
        //    is present on a given side of the grid.
        // series - series by series defaults.  Don't know how useful this is.
        this.defaults = {
            axesDefaults: {},
            axes: {xaxis:{}, yaxis:{}, x2axis:{}, y2axis:{}},
            seriesDefaults: {},
            gridPadding: {top:10, right:10, bottom:10, left:10},
            series:[]
        };
        // prop: series
        // Array of series object options.
        this.series = [];
        // prop: axes
        // up to 4 axes are supported, each with it's own options, 
        // see <$.jqplot.LinearAxisRenderer>
        this.axes = {xaxis: new Axis('xaxis'), yaxis: new Axis('yaxis'), x2axis: new Axis('x2axis'), y2axis: new Axis('y2axis')};
        // prop: grid
        // see <$.jqplot.canvasGridRenderer>
        this.grid = new Grid();
        // prop: legend
        // see <$.jqplot.TableLegendRenderer>
        this.legend = new Legend();
        this.seriesCanvas = new SeriesCanvas();
        this.overlayCanvas = new OverlayCanvas();
        this._width = null;
        this._height = null; 
        this._plotDimensions = {height:null, width:null};
        this._gridPadding = {top:10, right:10, bottom:10, left:10};
        // prop: equalXTicks
        // for dual axes, wether to space ticks the same on both sides.
        this.equalXTicks = true;
        // prop: equalYTicks
        // for dual axes, wether to space ticks the same on both sides.
        this.equalYTicks = true;
        // prop: seriesColors
        // default colors for the series.#c29549
        this.seriesColors = [ "#4bb2c5", "#c5b47f", "#EAA228", "#579575", "#839557", "#958c12", "#953579"];
        this._seriesColorsIndex = 0;
        // prop textColor
        // css spec for the css color attribute.  Default for the entire plot.
        this.textColor = '#666666';
        // prop; fontFamily
        // css spec for the font-family attribute.  Default for the entire plot.
        this.fontFamily = 'Trebuchet MS, Arial, Helvetica, sans-serif';
        // prop: fontSize
        // css spec for the font-size attribute.  Default for the entire plot.
        this.fontSize = '1em';
        // prop: title
        this.title = new Title();
        // container to hold all of the merged options.  Convienence for plugins.
        this.options = {};
            
        this.init = function(target, data, options) {
            for (var i=0; i<$.jqplot.preInitHooks.length; i++) {
                $.jqplot.preInitHooks[i].call(this, target, data, options);
            }
            this.targetId = target;
            this.target = $('#'+target);
            if (!this.target.get(0)) throw "No plot target specified";
            
            // make sure the target is positioned by some means and set css
            if (this.target.css('position') == 'static') this.target.css('position', 'relative');
            this.target.css('color', this.textColor);
            this.target.css('font-family', this.fontFamily);
            this.target.css('font-size', this.fontSize);
            
            this._height = parseFloat(this.target.css('height'));
            this._width = parseFloat(this.target.css('width'));
            this._plotDimensions.height = this._height;
            this._plotDimensions.width = this._width;
            this.grid._plotDimensions = this._plotDimensions;
            this.title._plotDimensions = this._plotDimensions;
            this.seriesCanvas._plotDimensions = this._plotDimensions;
            this.overlayCanvas._plotDimensions = this._plotDimensions;
            this.legend._plotDimensions = this._plotDimensions;
            if (this._height <=0 || this._width <=0 || !this._height || !this._width) throw "Canvas dimensions <=0";
            
            // get a handle to the plot object from the target to help with events.
            // $(target).data('jqplot', this);
            
            this.data = data;
            
            this.parseOptions(options);
            this.title.init();
            this.legend.init();
            
            for (var i=0; i<this.series.length; i++) {
                for (var j=0; j<$.jqplot.preSeriesInitHooks.length; j++) {
                    $.jqplot.preSeriesInitHooks[j].call(this.series[i], target, data, options);
                }
                this.series[i]._plotDimensions = this._plotDimensions;
                this.series[i].init();
                for (var j=0; j<$.jqplot.postSeriesInitHooks.length; j++) {
                    $.jqplot.postSeriesInitHooks[j].call(this.series[i], target, data, options);
                }
            }

            for (var name in this.axes) {
                this.axes[name]._plotDimensions = this._plotDimensions;
                this.axes[name].init();
            }
            
            this.grid.init();
            this.grid._axes = this.axes;
            
            this.legend._series = this.series;
            
            for (var i=0; i<$.jqplot.postInitHooks.length; i++) {
                $.jqplot.postInitHooks[i].call(this, target, data, options);
            }
        };  
        
        this.getNextSeriesColor = function() {
            var c = this.seriesColors[this._seriesColorsIndex];
            this._seriesColorsIndex++;
            return c;
        }
    
        this.parseOptions = function(options){
            for (var i=0; i<$.jqplot.preParseOptionsHooks.length; i++) {
                $.jqplot.preParseOptionsHooks[i].call(this, options);
            }
            this.options = $.extend(true, {}, this.defaults, options);
            this._gridPadding = this.options.gridPadding;
            for (var n in this.axes) {
                var axis = this.axes[n];
                $.extend(true, axis, this.options.axesDefaults, this.options.axes[n]);
                axis._plotWidth = this._width;
                axis._plotHeight = this._height;
            }
            if (this.data.length == 0) {
                this.data = [];
                for (var i=0; i<this.options.series.length; i++) {
                    this.data.push(this.options.series.data);
                }    
            }
                
            function normalizeData(data) {
                // return data as an array of point arrays,
                // in form [[x1,y1...], [x2,y2...], ...]
                var temp = [];
                var i;
                if (!(data[0] instanceof Array)) {
                    // we have a series of scalars.  One line with just y values.
                    // turn the scalar list of data into a data array of form:
                    // [[1, data[0]], [2, data[1]], ...]
                    for (i=0; i<data.length; i++) {
                        temp.push([i+1, data[i]]);
                    }
                }
            
                else {
                    // we have a properly formatted data series, copy it.
                    $.extend(true, temp, data);
                }
                return temp;
            };

            for (var i=0; i<this.data.length; i++) { 
                var temp = new Series();
                for (var j=0; j<$.jqplot.preParseSeriesOptionsHooks.length; j++) {
                    $.jqplot.preParseSeriesOptionsHooks[j].call(temp, this.options.seriesDefaults, this.options.series[i]);
                }
                $.extend(true, temp, this.options.seriesDefaults, this.options.series[i]);
                temp.data = normalizeData(this.data[i]);
                switch (temp.xaxis) {
                    case 'xaxis':
                        temp._xaxis = this.axes.xaxis;
                        break;
                    case 'x2axis':
                        temp._xaxis = this.axes.x2axis;
                        break;
                    default:
                        break;
                }
                switch (temp.yaxis) {
                    case 'yaxis':
                        temp._yaxis = this.axes.yaxis;
                        break;
                    case 'y2axis':
                        temp._yaxis = this.axes.y2axis;
                        break;
                    default:
                        break;
                }
                temp._xaxis._series.push(temp);
                temp._yaxis._series.push(temp);
                if (temp.show) {
                    temp._xaxis.show = true;
                    temp._yaxis.show = true;
                }

                // parse the renderer options and apply default colors if not provided
                if (!temp.color && temp.show != false) {
                    temp.color = this.getNextSeriesColor();
                }
                if (!temp.label) temp.label = 'Series '+ (i+1).toString();
                // temp.rendererOptions.show = temp.show;
                // $.extend(true, temp.renderer, {color:this.seriesColors[i]}, this.rendererOptions);
                this.series.push(temp);  
                for (var j=0; j<$.jqplot.postParseSeriesOptionsHooks.length; j++) {
                    $.jqplot.postParseSeriesOptionsHooks[j].call(this.series[i], this.options.seriesDefaults, this.options.series[i]);
                }
            }
            
            // copy the grid and title options into this object.
            $.extend(true, this.grid, this.options.grid);
            if (typeof this.options.title == 'string') this.title.text = this.options.title;
            else if (typeof this.options.title == 'object') $.extend(true, this.title, this.options.title);
            this.title._plotWidth = this._width;
            $.extend(true, this.legend, this.options.legend);
            
            for (var i=0; i<$.jqplot.postParseOptionsHooks.length; i++) {
                $.jqplot.postParseOptionsHooks[i].call(this, options);
            }
        };
    
        this.draw = function(){
            for (var i=0; i<$.jqplot.preDrawHooks.length; i++) {
                $.jqplot.preDrawHooks[i].call(this);
            }
            this.target.append(this.title.draw());
            this.title.pack({top:0, left:0});
            for (var name in this.axes) {
                this.target.append(this.axes[name].draw());
                this.axes[name].set();
            }
            if (this.axes.yaxis.show) this._gridPadding.left = this.axes.yaxis.getWidth();
            if (this.axes.y2axis.show) this._gridPadding.right = this.axes.y2axis.getWidth();
            if (this.title.show && this.axes.x2axis.show) this._gridPadding.top = this.title.getHeight() + this.axes.x2axis.getHeight();
            else if (this.title.show) this._gridPadding.top = this.title.getHeight();
            else if (this.axes.x2axis.show) this._gridPadding.top = this.axes.x2axis.getHeight();
            if (this.axes.xaxis.show) this._gridPadding.bottom = this.axes.xaxis.getHeight();
            
            this.axes.yaxis.pack({position:'absolute', top:0, left:0, height:this._height}, {min:this._height - this._gridPadding.bottom, max: this._gridPadding.top});
            this.axes.x2axis.pack({position:'absolute', top:this.title.getHeight(), left:0, width:this._width}, {min:this._gridPadding.left, max:this._width - this._gridPadding.right});
            this.axes.xaxis.pack({position:'absolute', bottom:0, left:0, width:this._width}, {min:this._gridPadding.left, max:this._width - this._gridPadding.right});
            this.axes.y2axis.pack({position:'absolute', top:0, right:0}, {min:this._height - this._gridPadding.bottom, max: this._gridPadding.top});
            
            this.target.append(this.grid.createElement(this._gridPadding));
            this.grid.draw();
            this.target.append(this.seriesCanvas.createElement(this._gridPadding));
            var sctx = this.seriesCanvas.setContext();
            this.target.append(this.overlayCanvas.createElement(this._gridPadding));
            var octx = this.overlayCanvas.setContext();
            
            // bind custom event handlers to regular events.
            this.bindCustomEvents();
            
            this.drawSeries(sctx);

            // finally, draw and pack the legend
            this.target.append(this.legend.draw());
            this.legend.pack(this._gridPadding);
            
            // register event listeners on the overlay canvas
            for (i=0; i<$.jqplot.eventListenerHooks.length; i++) {
                var h = $.jqplot.eventListenerHooks[i];
                // in the handler, this will refer to the overlayCanvas dom element.
                // make sure there are references back into plot objects.
                this.overlayCanvas._elem.bind(h[0], {plot:this}, h[1]);
            }

            for (var i=0; i<$.jqplot.postDrawHooks.length; i++) {
                $.jqplot.postDrawHooks[i].call(this);
            }
        };
        
        this.bindCustomEvents = function() {
            this.overlayCanvas._elem.bind('click', {plot:this}, this.onClick);
            this.overlayCanvas._elem.bind('mousedown', {plot:this}, this.onMouseDown);
            this.overlayCanvas._elem.bind('mouseup', {plot:this}, this.onMouseUp);
            this.overlayCanvas._elem.bind('mousemove', {plot:this}, this.onMouseMove);
            this.overlayCanvas._elem.bind('mouseenter', {plot:this}, this.onMouseEnter);
            this.overlayCanvas._elem.bind('mouseleave', {plot:this}, this.onMouseLeave);
        };
        
        function getEventPosition(ev) {
    	    var plot = ev.data.plot;
    	    var xaxis = plot.axes.xaxis;
    	    var x2axis = plot.axes.x2axis;
    	    var yaxis = plot.axes.yaxis;
    	    var y2axis = plot.axes.y2axis;
    	    var offsets = plot.overlayCanvas._elem.offset();
    	    var gridPos = {x:ev.pageX - offsets.left, y:ev.pageY - offsets.top};
    	    var dataPos = {x1y1:{x:null, y:null}, x1y2:{x:null, y:null}, x2y1:{x:null, y:null}, x2y2:{x:null, y:null}};
    	    if (xaxis.show) {
    	        if (yaxis.show) {
    	            dataPos.x1y1.x = xaxis.series_p2u(gridPos.x);
    	            dataPos.x1y1.y = yaxis.series_p2u(gridPos.y);
    	        }
    	        if (y2axis.show) {
    	            dataPos.x1y2.x = xaxis.series_p2u(gridPos.x);
    	            dataPos.x1y2.y = y2axis.series_p2u(gridPos.y);
    	        }
    	    }
    	    if (x2axis.show) {
    	        if (yaxis.show) {
    	            dataPos.x2y1.x = x2axis.series_p2u(gridPos.x);
    	            dataPos.x2y1.y = yaxis.series_p2u(gridPos.y);
    	        }
    	        if (y2axis.show) {
    	            dataPos.x2y2.x = x2axis.series_p2u(gridPos.x);
    	            dataPos.x2y2.y = y2axis.series_p2u(gridPos.y);
    	        }
    	    }
            return ({offsets:offsets, gridPos:gridPos, dataPos:dataPos});
        };
        
        function getNeighborPoint(plot, x, y) {
            // won't you be mine?
            var ret = null;
            var s, i, d0, d, j;
            var threshold;
            for (i=0; i<plot.series.length; i++) {
                s = plot.series[i];
                if (s.show) {
                    threshold = s.markerRenderer.size/2+4;
                    for (j=0; j<s.gridData.length; j++) {
                       p = s.gridData[j];
                       d = Math.sqrt( (x-p[0]) * (x-p[0]) + (y-p[1]) * (y-p[1]) );
                       if (d <= threshold && (d <= d0 || d0 == null)) {
                           d0 = d;
                           ret = {seriesIndex: i, pointIndex:j, gridData:p, data:s.data[j]};
                       }
                    } 
                }
            }
            return ret;
        };
        
        this.onClick = function(ev) {
            // Event passed in is unnormalized and will have data attribute.
            // Event passed out in normalized and won't have data attribute.
            var positions = getEventPosition(ev);
            var p = ev.data.plot;
            var neighbor = getNeighborPoint(p, positions.gridPos.x, positions.gridPos.y);
    	    ev.data.plot.overlayCanvas._elem.trigger('jqplotClick', [positions.gridPos, positions.dataPos, neighbor, p]);
        };
        
        this.onMouseDown = function(ev) {
            var positions = getEventPosition(ev);
            var p = ev.data.plot;
            var neighbor = getNeighborPoint(p, positions.gridPos.x, positions.gridPos.y);
    	    ev.data.plot.overlayCanvas._elem.trigger('jqplotMouseDown', [positions.gridPos, positions.dataPos, neighbor, p]);
        };
        
        this.onMouseUp = function(ev) {
            var positions = getEventPosition(ev);
    	    ev.data.plot.overlayCanvas._elem.trigger('jqplotMouseUp', [positions.gridPos, positions.dataPos, null, ev.data.plot]);
        };
        
        this.onMouseMove = function(ev) {
            var positions = getEventPosition(ev);
            var p = ev.data.plot;
            var neighbor = getNeighborPoint(p, positions.gridPos.x, positions.gridPos.y);
    	    ev.data.plot.overlayCanvas._elem.trigger('jqplotMouseMove', [positions.gridPos, positions.dataPos, neighbor, p]);
        };
        
        this.onMouseEnter = function(ev) {
            var positions = getEventPosition(ev);
            var p = ev.data.plot;
    	    ev.data.plot.overlayCanvas._elem.trigger('jqplotMouseEnter', [positions.gridPos, positions.dataPos, null, p]);
        };
        
        this.onMouseLeave = function(ev) {
            var positions = getEventPosition(ev);
            var p = ev.data.plot;
    	    ev.data.plot.overlayCanvas._elem.trigger('jqplotMouseLeave', [positions.gridPos, positions.dataPos, null, p]);
        };
        this.drawSeries = function(sctx){
            // first clear the canvas
            sctx.clearRect(0,0,sctx.canvas.width, sctx.canvas.height);
            for (var i=0; i<this.series.length; i++) {
                if (this.series[i].show) {
                    for (var j=0; j<$.jqplot.preDrawSeriesHooks.length; j++) {
                        $.jqplot.preDrawSeriesHooks[j].call(this.series[i], sctx);
                    }
                    this.series[i].draw(sctx);
                    for (var j=0; j<$.jqplot.postDrawSeriesHooks.length; j++) {
                        $.jqplot.postDrawSeriesHooks[j].call(this.series[i], sctx);
                    }
                }
            }
        };
    };

    // convert a hex color string to rgb string.
    // h - 3 or 6 character hex string, with or without leading #
    // a - optional alpha
    $.jqplot.hex2rgb = function(h, a) {
        h = h.replace('#', '');
        if (h.length == 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
        var rgb;
        rgb = 'rgba('+parseInt(h.slice(0,2), 16)+', '+parseInt(h.slice(2,4), 16)+', '+parseInt(h.slice(4,6), 16);
        if (a) rgb += ', '+a;
        rgb += ')';
        return rgb;
    };
    
    // convert an rgb color spec to a hex spec.  ignore any alpha specification.
    $.jqplot.rgb2hex = function(s) {
        var pat = /rgba?\( *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *(?:, *[0-9.]*)?\)/;
        var m = s.match(pat);
        var h = '#';
        for (var i=1; i<4; i++) {
            var temp;
            if (m[i].search(/%/) != -1) {
                temp = parseInt(255*m[i]/100).toString(16);
                if (temp.length == 1) temp = '0'+temp;
            }
            else {
                temp = parseInt(m[i]).toString(16);
                if (temp.length == 1) temp = '0'+temp;
            }
            h += temp;
        }
        return h
    };
    
    // given a css color spec, return an rgb css color spec
    $.jqplot.normalize2rgb = function(s, a) {
        if (s.search(/^ *rgba?\(/) != -1) {
            return s; 
        }
        else if (s.search(/^ *#?[0-9a-fA-F]?[0-9a-fA-F]/) != -1) {
            return $.jqplot.hex2rgb(s, a);
        }
        else throw 'invalid color spec';
    };
    
    // extract the r, g, b, a color components out of a css color spec.
    $.jqplot.getColorComponents = function(s) {
        var rgb = $.jqplot.normalize2rgb(s);
        var pat = /rgba?\( *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *,? *([0-9.]* *)?\)/;
        var m = rgb.match(pat);
        var ret = [];
        for (var i=1; i<4; i++) {
            if (m[i].search(/%/) != -1) {
                ret[i-1] = parseInt(255*m[i]/100);
            }
            else {
                ret[i-1] = parseInt(m[i]);
            }
        }
        ret[3] = parseFloat(m[4]) ? parseFloat(m[4]) : 1.0;
        return ret;
    };
        
	// Convienence function that won't hang IE.
	$.jqplot.log = function() {
	    if (window.console && $.jqplot.debug) {
	       if (arguments.length == 1) console.log (arguments[0]);
	       else console.log(arguments);
	    }
	};
	var log = $.jqplot.log;
	
})(jQuery);