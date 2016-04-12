$(window).resize(function() {
            $('.tt-dropdown-menu').css('max-height', $('#container').height()-$('.navbar').height()-20);
});

 var map = L.map("map", {
            zoom: 9,
            center: new L.LatLng(39.97, -75.16),
			});

    googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
maxZoom: 20,
subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);
			
		var acetateUrl = 'http://{s}.acetate.geoiq.com/tiles/acetate/{z}/{x}/{y}.png';
        var acetateAttrib = '2011 GeoIQ & Stamen, Data from OSM and Natural Earth';
        var acetate = new L.TileLayer(acetateUrl, {maxZoom: 18, attribution: acetateAttrib, subdomains: ['a1', 'a2', 'a3']});

        // set view to leeds, and add layer. method chaining, yumm.
        map.addLayer(acetate);
		
  
var label = new L.Label(); 
 
function hover(e) { 
 var layer = e.target;
var props = layer.feature.properties;
 info.update(layer.feature.properties);
layer.setStyle({
    weight: 1,
	   color: '#D3D3D3',
	   opacity:1
    })
    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }			
}

function resetHighlight() {
	  var layer = e.target;                        
	  //return layer to back of map
	  if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToBack();
	    } 
	  lsoaLayer.resetStyle(e.target);
	  info.update();
}
		
var viewCenter = new L.Control.ViewCenter();
					map.addControl(viewCenter);

    var scaleControl = L.control.scale({
            position: 'bottomright'
        });

					///////Load MAP JSONS
  getIMDStyle = function (feature) {
    return {
      color: '#666',
      weight: 0.45,
      opacity: 1,
      fillOpacity: 0.0,
      fillColor: '#D9D9D9'
    }
  }, 			

 lsoaLayer = L.geoJson(null, {
   
   style: getIMDStyle,
    onEachFeature: function(feature, layer){
      if (feature.properties) {
    layer.on({click:populatepie});
    layer.on({click:highlightPoly});
	  layer.on({mouseover: hover});
	  layer.on({mouseout: resetHighlight});
      }
    }
  });

  $.getJSON('data/landuse.js', function (data) {
      lsoaLayer.addData(data);
        });

  var DVRPC = L.geoJson(null, {
            style: {
                color: 'black',
				weight: 4,
                fill: false,
                opacity: 0.75,
                clickable: false
            }
        });
        $.getJSON("data/County_DVRPC.js", function (data) {
            DVRPC.addData(data);
});

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<B></B>' +  (props ?
        '<h4>' + props.MUN_NAME + '</h4>'
        : '');
};

info.addTo(map);


map.addLayer(lsoaLayer);
map.addLayer(DVRPC);

//////hack to resolve layerOrder add after layers added
lsoaLayer.once('mouseover', function(e){        //create eventListener on mouseover of lsoaLayer (only active once rendered)
    DVRPC.bringToFront();                     //push counties to front of map pane
   // lsoaLayer.off();                          //kill eventListener          
});

    function highlightPoly(e) {
                resetHighlight();
                var layer = e.target;
                var layersearch = e.feature;   
                if (layersearch===undefined){  
                    layer.setStyle({ 
                    weight: 6,color:"#00ffff"
                    });
                    var props = layer.feature.properties;
                }else{                        
                    e.setStyle({ 
                    weight: 6,color:"#00ffff"
                    });
                    var props = layersearch.properties;
                }          
            var content = "<div style='text-align:center;width:350px'><b>"+numeral(props.Total).format('0,0')+" total acres</b> within "+(props.MUN_NAME)
                          +"</br>"+(props.CO_NAME)+" County, "+(props.STATE_NAME)
                          +"</div>"   
                          ;
        
            document.getElementById('infosidebar').innerHTML = content;
            };
   
      function populatepie(e) {
          var layer = e.target;
          var props = layer.feature.properties,
          Population = [props.Single_fam,props.Multi,props.Industrial,props.Transporta,props.Utility,props.Commercial,props.Comm_ser,props.Military,props.Recreation,props.Agr_bog,props.Wooded,props.Vacant,props.Water];
          updateCtyChart(Population);
//    }    
          
    function updateCtyChart(Values){
    var CtyChart = {

            chart: {
                renderTo: 'Population',
                type:'pie',
                plotBackgroundColor: null,
                plotBorderWidth: 0, //null,
                plotShadow: true,
                height: 350,
                width: 350,
                colors: ['#FFFF00', '#FFA77F','#AA66CD','#686868','#FF0000','#BEE8FF','#0084A8','#E6E600','#D7D79E','#A80000','#4CE600','#A5F57A','#00C5FF']
        /*   events: {
            load: function(event) {
              var total = 0;
                for(var i=0, len=this.series[0].yData.length; i<len; i++){
                    total += this.series[0].yData[i];
                //    +Highcharts.numberFormat(this.point.y,0,',',',')+
                }
              var text = this.renderer.text(
                total + '</br> Acres',135,135
            //    this.plotTop - 1
            ).attr({
                zIndex: 5
            }).add()
            }
              } */
            },
         title: {
          text: null
          //  text: '2015 Land Use by Acre',
          //  align: 'center',
          //  y: -50,
          //  verticalAlign: 'middle',
          //    style: {
          //          fontSize: '9.5px'
          //  }
        }, 

           plotOptions: {
                pie: {
                  //  allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                          enabled: false
                        //  enabled:true,
                        //   style: '{text-align: center}',
                      //  verticalAlign: 'middle',
                      //  distance: 20,
                     //   format: '<span>{point.percentage:.0f} %</span>',
                    },
                    showInLegend: true
                }
            },
          legend: {
             title: {
                text: '<span style="text-align:center;font-size: 9px; color: #666; font-weight: normal">Landuse Categories</span>',
                style: {
                    fontStyle: 'italic'
                }
            },
          layout:'horizontal'
        },
        tooltip: {
            formatter:function(){
              //  return '<b>'+Highcharts.numberFormat(this.point.y,0,',',',')+' Acres</b><br/>';
                return '<b>'+this.point.name +'</b><br/>'+Highcharts.numberFormat(this.point.y,0,',',',')+' Acres<br/>'+Highcharts.numberFormat(this.percentage, 2)+' %';
            }
            },
            credits: {
                enabled: false
            },
            series: [{
               name:'Total',
               id: 'Values',
               innerSize: '60%',
               colors: ['#FFFF00', '#FFA77F','#AA66CD','#686868','#FFBEBE','#FF0000','#BEE8FF','#0084A8','#E6E600','#D7D79E','#4CE600','#A5F57A','#00C5FF'],
               data: []
            }]
    };    
    var Labels = ["Single Family", "Multi Family","Industrial","Transportation","Utility", "Commercial","Community Serive","Military","Recreation", "Agricultural","Wooded","Vacant","Water"],
    counData = [];
    for (var i = 0; i < Values.length; i++){
                counData.push({
                    name: Labels[i],
                    y: Values[i]})
            }
    CtyChart.series[0].data = counData;
    var chart2 = new Highcharts.Chart(CtyChart)

    }

  };
