/**
* Copyright (c) 2009 Chris Leonello
* This software is licensed under the GPL version 2.0 and MIT licenses.
*/
(function($) {
	// class: $.jqplot.shadowRenderer
	// The default jqPlot shadow renderer, rendering shadows behind shapes.
    $.jqplot.ShadowRenderer = function(options){ 
        // Group: Properties
        
        // prop: angle
        // Angle of the shadow in degrees.  Measured counter-clockwise from the x axis.
        this.angle = 45;
        // prop: offset
        // Pixel offset at the given shadow angle of each shadow stroke from the last stroke.
        this.offset = 1;
        // prop: alpha
        // alpha transparency of shadow stroke.
        this.alpha = 0.07;
        // prop: lineWidth
        // width of the shadow line stroke.
        this.lineWidth = 1.5;
        // prop: lineJoin
        // How line segments of the shadow are joined.
        this.lineJoin = 'miter';
        // prop: lineCap
        // how ends of the shadow line are rendered.
        this.lineCap = 'round';
        // prop; closePath
        // whether line path segment is closed upon itself.
        this.closePath = false;
        // prop: fill
        // whether to fill the shape.
        this.fill = false;
        // prop: depth
        // how many times the shadow is stroked.  Each stroke will be offset by offset at angle degrees.
        this.depth = 3;
        // prop: isarc
        // wether the shadow is an arc or not.
        this.isarc = false;
        
        $.extend(true, this, options);
    };
    
    $.jqplot.ShadowRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
    };
    
    // function: draw
    // draws an transparent black (i.e. gray) shadow.
    //
    // ctx - canvas drawing context
    // points - array of points or [x, y, radius, start angle (rad), end angle (rad)]
    $.jqplot.ShadowRenderer.prototype.draw = function(ctx, points, options) {
        ctx.save();
        var opts = (options != null) ? options : {};
        var fill = (opts.fill != null) ? opts.fill : this.fill;
        var closePath = (opts.closePath != null) ? opts.closePath : this.closePath;
        ctx.lineWidth = this.lineWidth;
        ctx.lineJoin = this.lineJoin;
        ctx.lineCap = this.lineCap;
        ctx.strokeStyle = 'rgba(0,0,0,'+this.alpha+')';
        ctx.fillStyle = 'rgba(0,0,0,'+this.alpha+')';
        for (var j=0; j<this.depth; j++) {
            ctx.translate(Math.cos(this.angle*Math.PI/180)*this.offset, Math.sin(this.angle*Math.PI/180)*this.offset);
            ctx.beginPath();
            if (this.isarc) {
                ctx.arc(points[0], points[1], points[2], points[3], points[4], true);                
            }
            else {
                ctx.moveTo(points[0][0], points[0][1]);
                for (var i=1; i<points.length; i++) {
                    ctx.lineTo(points[i][0], points[i][1]);
                }
                
            }
            if (closePath) {
            	ctx.closePath();
            }
            if (fill) {
            	ctx.fill();
            }
            else {
                ctx.stroke();
            }
        }
        ctx.restore();
    };
})(jQuery);    