
var layersearch, props, header, content, featureName, featureClass, featureIcon;
            function populateCounty(e) {
              //  lsoaLayer.setStyle({fillColor: "#396ab2"});
                var layer = e.target;
                layer.setStyle({fillColor: "#312867"});

                var props = layer.feature.properties,

				 Homes = [props.HUOCC,props.HUVACANT],
				 Population = [props.ALLWHITE,props.ALLBLK,props.ALLASIAN,props.HISPTOT];
				 Transportation =  [props.AUTO, props.PUBLTRAN, props.STCARTROLL, props.SUBEL, props.RR, props.FERRY,props.TAXI,props.MOTORCYC, props.BIKE,props.WALK,props.OTHER,props.TELECOMM],
				// CtyEmp =  [props.SUM_Emp00, props.SUM_Emp10, props.SUM_Emp15, props.SUM_Emp20, props.SUM_Emp25, props.SUM_Emp30, props.SUM_Emp35, props.SUM_Emp40];
		
			   updatePopCty(Homes);
         updateCtyChart(Population);
         updateEmpChart(Transportation);
       //updateEmpCty(CtyEmp);
			//	$('#myTab a[href="#POP"]').tab('show')
            }
        
		
