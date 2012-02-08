<?php 
    $title = "Mekko Charts";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>700, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->
  <style type="text/css" media="screen">
    body {
        margin: 15px;
        font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    }
    
    p {
        margin-top: 20px;
        margin-bottom: 20px;
    }
    
    .jqplot-target {
        margin: 60px;
    }
    
    pre {
        padding: 10px;
        background-color: #efead9;
        margin: 10px;
    }
    .jqplot-axis {
      font-size: 0.8em;
    }
    
    .jqplot-mekko-barLabel {
        font-size: 1em;
    }
    
    #chart2 .jqplot-axis {
        font-size: 0.7em;
    }
    
    #chart3 .jqplot-title {
        padding-bottom: 40px;
    }
  </style>
<p>Data is specified per bar in the chart.  You can specify data as an array of y values, or as an array of [label, value] pairs.  Note that labels are used only on the first series.  Labels on subsequent series are ignored:</p>
<pre>
bar1 = [['shirts', 8],['hats', 14],['shoes', 6],['gloves', 16],['dolls', 12]];
bar2 = [15,6,9,13,6];
bar3 = [['grumpy',4],['sneezy',2],['happy',7],['sleepy',9],['doc',7]];
</pre>

  <p>If you want to place labels for each bar under the axis, you use the barLabels option on the axes.  The bar labels can be styled with the ".jqplot-mekko-barLabel" css class.</p>
<pre>
barLabels = ['Mickey Mouse', 'Donald Duck', 'Goofy'];
axes:{xaxis:{barLabels:barLabels}}
</pre>

    <div id="chart1" style="width:500px; height:300px;"></div>
    
    <p>You can add a secondary x axes, and the tick spacing of the axes can be separately controlled with the "tickMode" option.  "bar" will produce tics at bar boundaries, "even" will produce evenly spaced ticks.  If you set the axes max greater than the sum of the data range (the maximum x value), the plot will be padded.  Note that you should set the max on both axes to the same value.</p>

<pre>
axes:{
    xaxis:{
        barLabels:barLabels,
        max: 175
    }, 
    x2axis:{
        show:true, 
        tickMode:'even', 
        max: 175
    }
}
</pre>

    <p>Here the borders between chart areas have been given a custom color using the "borderColor" option on the series renderer.</p>
    
<pre>
    seriesDefaults:{renderer:$.jqplot.MekkoRenderer, rendererOptions: {borderColor: '#dddddd'}}
</pre>

    <p>Additionally, the legend can be placed "outside" (the default for a mekko chart) or "inside" of the grid area with the "placement" option on the legend renderer.</p>

<pre>
legend:{
    show:true, 
    rendererOptions:{placement: "insideGrid"}, 
    location:'e'
},
</pre>
    
    <div id="chart2" style="width:500px; height:300px;"></div>
    
    <p>Legend labels can be specified independently of the series with the "labels" option on the legend.  These will override any labels specified with the series. There are also options to control the number of rows and number of columns in the legend as well as placement.</p>
    
    <p>Here the legend is positioned to the "north" and set to render 1 row tall (number of columns determined automatically).  Note that an extra css specification was added to pad the bottom of the title of this chart to give room for the legend above the plot.</p>
    
<pre>
legendLabels = ['hotels', 'rides', 'buses', 'instruments', 'totes'];

legend:{
    show:true, 
    location: 'n',
    labels: legendLabels,
    rendererOptions:{numberRows: 1, placement: "outside"}
},    
</pre>

    <p>Also, the borders between the chart areas have been turned off with the "showBorders: false" option.</p>
    
<pre>
    seriesDefaults:{renderer:$.jqplot.MekkoRenderer, rendererOptions: {showBorders: false}}
</pre>

    <div id="chart3" style="width:500px; height:300px;"></div>

<script type="text/javascript" class="code">
$(document).ready(function(){
    var bar1 = [['shirts', 8],['hats', 14],['shoes', 6],['gloves', 16],['dolls', 12]];
    var bar2 = [15,6,9,13,6];
    var bar3 = [['grumpy',4],['sneezy',2],['happy',7],['sleepy',9],['doc',7]];
    var barLabels = ['Mickey Mouse', 'Donald Duck', 'Goofy'];

    var plot1 = $.jqplot('chart1', [bar1, bar2, bar3], {
        title: 'Revenue Breakdown per Character',
        seriesDefaults:{renderer:$.jqplot.MekkoRenderer},
        legend:{show:true},
        axesDefaults:{
            renderer:$.jqplot.MekkoAxisRenderer
        },
        axes:{
            xaxis:{ 
                barLabels:barLabels,
                tickOptions:{formatString:'$%dM'}
            }
        }
    });
});
</script>

<script type="text/javascript" class="code">
$(document).ready(function(){
    var bar1 = [['shirts', 8],['hats', 14],['shoes', 6],['gloves', 16],['dolls', 12]];
    var bar2 = [15,6,9,13,6];
    var bar3 = [['grumpy',4],['sneezy',2],['happy',7],['sleepy',9],['doc',7]];
    var barLabels = ['Mickey Mouse', 'Donald Duck', 'Goofy'];

    var plot2 = $.jqplot('chart2', [bar1, bar2, bar3], {
        title: 'Revenue Breakdown per Character',
        seriesDefaults:{renderer:$.jqplot.MekkoRenderer, rendererOptions: {borderColor: '#dddddd'}},
        legend:{
            show:true, 
            rendererOptions:{placement: "insideGrid"}, 
            location:'e'
        },
        axesDefaults:{
            renderer:$.jqplot.MekkoAxisRenderer, 
            tickOptions:{}
        },
        axes:{
            xaxis:{
                barLabels:barLabels,
				rendererOptions: {
				    barLabelOptions: {
				      angle: -35
				    },
    				barLabelRenderer: $.jqplot.CanvasAxisLabelRenderer
				}, 
                max: 175,
                tickOptions:{formatString:'$%dM'}
            }, 
            x2axis:{
                show:true, 
                tickMode:'even', 
                max: 175,
                tickOptions:{formatString:'$%dM'}
            }
        }
    });
});
</script>

<script type="text/javascript" class="code">
$(document).ready(function(){
    var bar1 = [['shirts', 8],['hats', 14],['shoes', 6],['gloves', 16],['dolls', 12]];
    var bar2 = [15,6,9,13,6];
    var bar3 = [['grumpy',4],['sneezy',2],['happy',7],['sleepy',9],['doc',7]];
    var barLabels = ['Mickey Mouse', 'Donald Duck', 'Goofy'];

    var legendLabels = ['hotels', 'rides', 'buses', 'instruments', 'totes'];
    
    var plot3 = $.jqplot('chart3', [bar1, bar2, bar3], {
        title: 'Revenue Breakdown per Character',
        seriesDefaults:{renderer:$.jqplot.MekkoRenderer, rendererOptions: {showBorders: false}},
        legend:{
            show:true, 
            location: 'n',
            labels: legendLabels,
            rendererOptions:{numberRows: 1, placement: "outside"}
        },
        axesDefaults:{
            renderer:$.jqplot.MekkoAxisRenderer, 
            tickOptions:{showGridline:false}
        },
        axes:{
            xaxis:{
                tickMode:"bar", 
                tickOptions:{formatString:'$%dM'}
            }
        }
    });
});
</script>

<!-- End example scripts -->

<!-- Don't touch this! -->

<?php include "commonScripts.html" ?>

<!-- End Don't touch this! -->

<!-- Additional plugins go here -->

  <script class="include" type="text/javascript" src="../src/jquery.jqplot.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.mekkoRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.mekkoAxisRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasTextRenderer.js"></script>
  <script class="include" type="text/javascript" src="../src/plugins/jqplot.canvasAxisLabelRenderer.js"></script>

<!-- End additional plugins -->

<?php include "closer.html"; ?>
