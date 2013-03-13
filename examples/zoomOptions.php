<?php 
    $title = "Zoom Options";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>600, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->
 <style type="text/css" media="screen">
    .jqplot-axis {
      font-size: 0.85em;
    }
    .jqplot-axis{
      font-size: 0.75em;
    }
  </style>

<p>Zooming has been enhanced to maintain plot zoom while the mouse moves over the entire document, not just the plot.  Two new options have been added to the cursor plugin to further enhance zooming:</p>

<dl>
   <dt>constrainOutsideZoom</dt>
    <dd>True to limit the resulting zoom area to the edges of grid, even if the cursor is outside of the grid.  That is, you can't expand the axis ranges by moving the cursor outside of the plot area when this is true.  If set to false, you can effectively zoom out by mousing outside of the plot region.  Default false.</dd>
    <dt>showTooltipOutsideZoom</dt>
    <dd>True to keep showing and updating the tooltip even when the cursor is outside of the plot area.  Not applicable if zoomOutsidePlot is false.  Default false</dd>
</dl>

<p>The first plot demonstrates the default functionality where you can move the mouse off of the plot while zooming but the actual area zoomed will not extend beyond the axes.</p>
    <div id="chart1" style="margin-top:20px; margin-left:20px; width:400px; height:200px;"></div>
    <div style="padding-top:20px"><button value="reset" type="button" onclick="plot1.resetZoom();">Reset Zoom</button></div>

    <pre class="code brush:js"></pre>

<p>The second plot sets constrainOutsideZoom to false, so zooming will not only function when the mouse is outside of the plot, but the zoom range will be extended to the mouse position outside of the grid.</p>
    <div id="chart2" style="margin-top:20px; margin-left:20px; width:400px; height:200px;"></div>
    <div style="padding-top:20px"><button value="reset" type="button" onclick="plot2.resetZoom();">Reset Zoom</button></div>

    <pre class="code brush:js"></pre>

<p>The third plot is like the third, but showTooltipOutsideZoom is true and the tooltip is set to follow the mouse, so you have an idea of what your range is while zooming.</p>
    <div id="chart3" style="margin-top:20px; margin-left:20px; width:400px; height:200px;"></div>
    <div style="padding-top:20px"><button value="reset" type="button" onclick="plot3.resetZoom();">Reset Zoom</button></div>

    <pre class="code brush:js"></pre>


  <script type="text/javascript" class="code">
  $(document).ready(function(){
      // Enable plugins like cursor and highlighter by default.
      $.jqplot.config.enablePlugins = true;
      // For these examples, don't show the to image button.
      $.jqplot._noToImageButton = true;

    goog = [["6/22/2009",425.32],["6/15/2009",420.09],["6/8/2009",424.84],["6/1/2009",444.32],["5/26/2009",417.23],
    ["5/18/2009",393.5],["5/11/2009",390],["5/4/2009",407.33],["4/27/2009",393.69],["4/20/2009",389.49],
    ["4/13/2009",392.24],["4/6/2009",372.5],["3/30/2009",369.78],["3/23/2009",347.7],["3/16/2009",330.16],
    ["3/9/2009",324.42],["3/2/2009",308.57],["2/23/2009",337.99],["2/17/2009",346.45],["2/9/2009",357.68],
    ["2/2/2009",371.28],["1/26/2009",338.53],["1/20/2009",324.7],["1/12/2009",299.67],["1/5/2009",315.07],
    ["12/29/2008",321.32],["12/22/2008",300.36],["12/15/2008",310.17],["12/8/2008",315.76],["12/1/2008",283.99],
    ["11/24/2008",292.96],["11/17/2008",262.43],["11/10/2008",310.02],["11/3/2008",331.14],["10/27/2008",359.36],
    ["10/20/2008",339.29],["10/13/2008",372.54],["10/6/2008",332],["9/29/2008",386.91],["9/22/2008",431.04],
    ["9/15/2008",449.15],["9/8/2008",437.66],["9/2/2008",444.25],["8/25/2008",463.29],["8/18/2008",490.59], 
    ["8/11/2008",510.15], ["8/4/2008",495.01], ["7/28/2008",467.86],["7/21/2008",491.98], ["7/14/2008",481.32],
    ["7/7/2008",533.8],["6/30/2008",537], ["6/23/2008",528.07], ["6/16/2008",546.43],["6/9/2008",571.51],["6/2/2008",567],
    ["5/27/2008",585.8],["5/19/2008",544.62], ["5/12/2008",580.07],["5/5/2008",573.2],["4/28/2008",581.29],
    ["4/21/2008",544.06],["4/14/2008",539.41],["4/7/2008",457.45], ["3/31/2008",471.09],["3/24/2008",438.08],
    ["3/17/2008",433.55], ["3/10/2008",437.92], ["3/3/2008",433.35],["2/25/2008",471.18],["2/19/2008",507.8],
    ["2/11/2008",529.64],["2/4/2008",516.69],["1/28/2008",515.9], ["1/22/2008",566.4],["1/14/2008",600.25],
    ["1/7/2008",638.25],["12/31/2007",657],["12/24/2007",702.53],["12/17/2007",696.69],["12/10/2007",689.96],
    ["12/3/2007",714.87], ["11/26/2007",693], ["11/19/2007",676.7],["11/12/2007",633.63],["11/5/2007",663.97],
    ["10/29/2007",711.25],["10/22/2007",674.6],["10/15/2007",644.71],["10/8/2007",637.39],["10/1/2007",594.05],
    ["9/24/2007",567.27], ["9/17/2007",560.1], ["9/10/2007",528.75], ["9/4/2007",519.35],["8/27/2007",515.25],
    ["8/20/2007",515]];


    opts = {
        title: 'Google, Inc.',
        series: [{
            neighborThreshold: 0
        }],
        axes: {
            xaxis: {
              renderer:$.jqplot.DateAxisRenderer,
              min:'August 1, 2007',
              tickInterval: "6 months",
              tickOptions:{formatString:"%Y/%#m/%#d"}
            },
            yaxis: {
                // renderer: $.jqplot.LogAxisRenderer,
                tickOptions:{prefix: '$'}
            }
        },
        cursor:{zoom:true}
    };

    plot1 = $.jqplot('chart1', [goog], opts);
    });

  </script>
  <script type="text/javascript" class="code">
  $(document).ready(function(){
    opts.cursor = {
        zoom:true, 
        looseZoom: true, 
        constrainOutsideZoom: false
    };

    plot2 = $.jqplot('chart2', [goog], opts);

    });
  </script>
  <script type="text/javascript" class="code">
  $(document).ready(function(){
    opts.cursor = {
        zoom:true, 
        looseZoom: true, 
        showTooltip:true, 
        followMouse: true, 
        showTooltipOutsideZoom: true, 
        constrainOutsideZoom: false
    };
    
    plot3 = $.jqplot('chart3', [goog], opts);
  });
  </script>

<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.dateAxisRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.cursor.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.highlighter.js"></script>
<!-- End additional plugins -->

<?php include "closer.php"; ?>