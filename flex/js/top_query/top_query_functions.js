//Time Picker Initialization and Custom Functions
$(document).ready(function() {
    $('.timepicker').timepicker({
        minuteStep: 1,
        secondStep: 1,
        template: 'dropdown',
        showSeconds: true,
        showMeridian: false,
        defaultTime: '00:00:00 AM'
    });

    $('.datepicker input').datepicker({
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy'
    });
});
$('form').submit(
    function() {
        return false;
    }
);
$(".submit.generic").click(function(e){
    var form = $(this).closest("form");
    console.log(form.serialize());
    $.ajax({
        url:  'top_query.php',
        type: 'POST',
        data: form.serialize(),
        success: function (result) {
            console.log("Success");
            $('#output').empty().append( "<pre>" + result + "</pre>" );
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#output').text("Http code = " + xhr.status + "\n" + "Error = " + thrownError);
        } 
    });  
});

$(".submit.notificationResearch").click(function(e){
    $('#json_loading_spinner').show();
    var form = $(this).closest("form");
    console.log(form.serialize());
    $.ajax({
        url:  'top_query.php',
        type: 'POST',
        data: form.serialize(),
        success: function (result) {
            console.log("Success");
            $('#json_output').empty().append( "<pre>" + result + "</pre>" );
            $('#json_loading_spinner').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#json_output').text("Http code = " + xhr.status + "\n" + "Error = " + thrownError);
            $('#json_loading_spinner').hide();
        } 
    });  
});

$(".submit.businessMetricsMonitoring").click(function(e){
    $('#json_loading_spinner').show();
    var form = $(this).closest("form");
    //console.log(form.serialize());
    $.ajax({
        url:  'business_metrics_monitoring.php',
        type: 'POST',
        data: form.serialize(),
        success: function (result, data) {
            $('#json_loading_spinner').hide();
            //console.log('RESULT ' + result);
            var formElements = form.serializeArray().reduce(
                function(acc,curr){
                    acc[curr.name] = curr.value;
                    return acc;
                },
                {}
            );
            
            $('#output').text('');
            if (formElements.metrics_business_model == 'subscription') {
                switch (formElements.metrics_temporal_dimension) {
                    case 'dayAndOperator':
                    case 'dayAndCountry':
                    case 'dayAndMerchant':
                        $('#output').text(
                            "It is not possible to aggregate the aquisitions by day"
                        );
                        $("#chart1").empty();
                        $("#chart2").empty();
                        return
                    case 'hourAndOperator': 
                    case 'hourAndCountry': 
                    case 'hourAndMerchant': 
                    case 'hourAndService': 
                        if (formElements.metrics_type == 'both') {
                            optionsChart1 = {
                                div:'#chart1',
                            };  
                            optionsChart2 = {
                                div:'#chart2',
                            };  
                            OnebipCharts.barChart(optionsChart1, [10, 4, 5, 3, 2, 5]);  
                            OnebipCharts.barChart(optionsChart2, [50, 20, 9, 40, 15]);  
                        } else {
                            optionsChart = {
                                div:'#chart1',
                                x: {
                                    label: 'Days',
                                },
                                y: {
                                    label: 'Percentage',
                                    min: 0,
                                    max: 100
                                }
                            }; 
                            result = JSON.parse(result);
                            var yvaluesObj = result.yvalues;
                            var yvalues=[];
                            yvalues.push(['x'].concat(result.xvalues));
                            for (var metrics in yvaluesObj) {
                                yvalues.push([metrics].concat(yvaluesObj[metrics]));
                            }
                            OnebipCharts.TimeseriesChart(
                                optionsChart, 
                                yvalues
                            );
                        }
                        return;
                    case 'overall':
                        $('#output').text(
                            "Not implemented yet"
                        );
                        $("#chart1").empty();
                        $("#chart2").empty();
                        return;
                }    
            // Purchases
            } else {
                if (formElements.service_id != 'No one') {
                    $('#output').text(
                        "It is not possible to retrieve metrics by service for the purchases"
                    );
                    $("#chart1").empty();
                    $("#chart2").empty();
                    return;
                }
                if ((formElements.metrics_type == 'both') ||
                    (formElements.metrics_type == 'conversion')
                ) {
                    $('#output').text(
                        "It is not possible to get conversion rate for the purchases"
                    );
                    $("#chart1").empty();
                    $("#chart2").empty();
                    return;
                } else {
                    switch (formElements.metrics_temporal_dimension) {
                        case 'dayAndOperator':
                        case 'dayAndCountry':
                        case 'dayAndMerchant':
                            $('#output').text(
                                "Not implemented yet"
                            );
                            $("#chart1").empty();
                            $("#chart2").empty();
                            return;
                        case 'hourAndService':
                            $('#output').text(
                                "It is not possible to filter by service for the purchases"
                            );
                            $("#chart1").empty();
                            $("#chart2").empty();
                            return;
                        case 'hourAndMerchant':
                        case 'hourAndOperator':
                        case 'hourAndCountry':
                            optionsChart = {
                                div:'#chart1',
                                x: {
                                    label: 'Hours',
                                },
                                y: {
                                    label: 'Percentage',
                                    min: 0,
                                    max: 100
                                }
                            };  
                            values = [ 
                                ['billingRate', 30, 90, 100, 45, 19, 76],
                            ];
                            OnebipCharts.lineChart(optionsChart, values);
                            break;
                    }
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#output').text(
                "Http code = " + xhr.status + "\n" + "Error = " + thrownError
            );
            $('#json_loading_spinner').hide();
        } 
    });  
});
