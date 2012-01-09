<?php 
    $title = "Meter Gauge";
    // $plotTargets = array (array('id'=>'chart1', 'width'=>700, 'height'=>400));
?>
<?php include "opener.php"; ?>

<!-- Example scripts go here -->


<style type="text/css">

.plot {
    margin-bottom: 30px;
    margin-left: auto;
    margin-right: auto;
}

#chart0 .jqplot-meterGauge-label {
    font-size: 10pt;
}

#chart1 .jqplot-meterGauge-tick {
    font-size: 6pt;
}

#chart2 .jqplot-meterGauge-tick {
    font-size: 8pt;
}

#chart3 .jqplot-meterGauge-tick, #chart0 .jqplot-meterGauge-tic {
    font-size: 10pt;
}

#chart4 .jqplot-meterGauge-tick, #chart4 .jqplot-meterGauge-label {
    font-size: 12pt;
}
</style>


<p>A meter gauge plot shows a data value in a speedometer style gauge.  The "series" in consists of a single data value that positions the needle on the gauge.  The span of the gauge will be automatically determined, or can be set with the "min" and "max" values in the "rendererOptions" of the series.  The plot below also specifies a chart title and a "label" for the gauge.</p>

<div id="chart0" class="plot" style="width:250px;height:170px;"></div>

<p>For small gauges, it can be desirable to turn off the tick labels by setting the "showTickLabels" option in the rendererOptions to false.  Also, colored interval bands can be specified.  The interval ranges are specified as an array of values the "intervals" option and custom colors for each interval can be specified with the "intervalColors" option.</p>

<div id="chart1" class="plot" style="width:120px;height:80px;"></div>

<p>The inner and outer radii of the interval band will automatically adjust when tick Labels are turned on.  Also, the gauge minimum and maximum can be specified with the "min" and "max" options in the rendererOptions.</p>

<div id="chart3" class="plot" style="width:300px;height:180px;"></div>

<p>The inner and outer radii of the interval band can also be specified with the "intervalInnerRadius" and "intervalOuterRadius" options.  In the plot below, the "labelPosition" option was set to "bottom" to put the gauge label below the plot.  The "labelHeightAdjust" option was set to -5 to raise the label slightly (5 pixels) to place it closer to the gauge.</p>
<p>The gauge automatically resizes to best fit the container.  The font size of the tick labels and gauge labels do not size to the container, however.  The font size of the tick labels can be controlled by styling the css ".jqplot-meterGauge-ticks" class and the gauge label by the "jqplot-meterGauge-label" class.</p>
<div id="chart4" class="plot" style="width:500px;height:300px;"></div>


<script type="text/javascript" class="code">
$(document).ready(function(){
   s1 = [1];

   plot0 = $.jqplot('chart0',[s1],{
       title: 'Network Speed',
       seriesDefaults: {
           renderer: $.jqplot.MeterGaugeRenderer,
           rendererOptions: {
               label: 'MB/s'
           }
       }
   });
});
</script>

<script type="text/javascript" class="code">
$(document).ready(function(){
   s1 = [1];

   plot1 = $.jqplot('chart1',[s1],{
       seriesDefaults: {
           renderer: $.jqplot.MeterGaugeRenderer,
           rendererOptions: {
               showTickLabels: false,
               intervals:[2,3,4],
               intervalColors:['#66cc66', '#E7E658', '#cc6666']
           }
       }
   });
});
</script>

<script type="text/javascript" class="code">
$(document).ready(function(){
   s1 = [322];

   plot3 = $.jqplot('chart3',[s1],{
       seriesDefaults: {
           renderer: $.jqplot.MeterGaugeRenderer,
           rendererOptions: {
               min: 100,
               max: 500,
               intervals:[200, 300, 400, 500],
               intervalColors:['#66cc66', '#93b75f', '#E7E658', '#cc6666']
           }
       }
   });
});
</script>

<script type="text/javascript" class="code">
$(document).ready(function(){
   s1 = [52200];

   plot4 = $.jqplot('chart4',[s1],{
       seriesDefaults: {
           renderer: $.jqplot.MeterGaugeRenderer,
           rendererOptions: {
               label: 'Metric Tons per Year',
               labelPosition: 'bottom',
               labelHeightAdjust: -5,
               intervalOuterRadius: 85,
               ticks: [10000, 30000, 50000, 70000],
               intervals:[22000, 55000, 70000],
               intervalColors:['#66cc66', '#E7E658', '#cc6666']
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

  <script class="include" type="text/javascript" src="../src/plugins/jqplot.meterGaugeRenderer.js"></script>

<!-- End additional plugins -->

<?php include "closer.html"; ?>
