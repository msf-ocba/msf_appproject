appConfigProjectMSF.controller('projectController', ["$scope",'$filter',"commonvariable", "OrgUnit","OrgUnitGroupsOrgUnit","FilterResource", "AddDataSetsToOrgUnit", function($scope, $filter,commonvariable,OrgUnit,OrgUnitGroupsOrgUnit,FilterResource,AddDataSetsToOrgUnit) {
	
	
	//set message variable
	$scope.closeAlertMessage = function(index) {
       $scope.messages.splice(index, 1);
  	};
	
	$scope.messages=[];
	
	$scope.prevOu=undefined;
	
	var $translate = $filter('translate');
	
	
	$scope.showfields=false;
	console.log(commonvariable.OrganisationUnit);
	
	
	$scope.sitesave=function(){
		
		
		var codeOrgUnit = undefined;
		
		if (commonvariable.OrganisationUnit.code!=undefined && commonvariable.OrganisationUnit.code.length>=7)
			codeOrgUnit = "OU_" + commonvariable.OrganisationUnit.code.slice(2,7) + $scope.siteprefix;
		

		var newOu={//payload
				name:commonvariable.ouDirective,
				level:(commonvariable.OrganisationUnit.level+1),
	            shortName:commonvariable.ouDirective,
	            code:codeOrgUnit,
	           	openingDate:$scope.siteDate,
	            parent:commonvariable.OrganisationUnit
				};

		OrgUnit.POST({},newOu)
		.$promise.then(function(data){
    		  console.log(data);
    		  if(data.status=="SUCCESS"){
    		  	  commonvariable.RefreshTreeOU=true;
				  newOu.id=data.lastImported;
				  commonvariable.NewOrganisationUnit=newOu;
				  
				  if (commonvariable.orgUnitGroupSet.ZxNjaKVXY1D!=undefined)
					  OrgUnitGroupsOrgUnit.POST({uidgroup:commonvariable.orgUnitGroupSet.ZxNjaKVXY1D.id, uidorgunit:newOu.id});
				  
				  
				  
				  FilterResource.GET({resource:'dataSets', filter:'code:eq:'+"DS_INFR_3"}).$promise
			  		.then(function(response){
			  			
			  			if (response.dataSets.length>0) {
			  				
			  				var dataSet = response.dataSets[0];
			  				AddDataSetsToOrgUnit.POST({uidorgunit:newOu.id, uiddataset:dataSet.id});
			  			}
			  							  			
			  		});
				  				  				  				  

				 //set message variable
				$scope.messages.push({type:"success",
				text:"Health site saved"});

				//clear txtbox
				$scope.siteName="";

			}
			else{
				$scope.messages.push({type:"danger",
				text:"Health site doesn't saved, review that the field name isn't empty"});
			}
    	 });
				
	};
		
	
	
	$scope.showForm=function(frm){
		
		if(frm==1){
			$scope.frmSite=true;
		}
		else{
			$scope.frmSite=false;
		}

		
	//	$scope.showfields=true;
	};
	
	
	
	$scope.hideForm=function(){
		$scope.mdname="";
		$scope.today();
		$scope.showfields=false;
	};
	
	$scope.$watch(
			function($scope) {
				if(commonvariable.OrganisationUnit!=undefined && commonvariable.OrganisationUnit.id != $scope.prevOu){
					
			        $scope.prevOu = commonvariable.OrganisationUnit.id;

					$scope.projectname=commonvariable.OrganisationUnit.name;
					$scope.projectcode=commonvariable.OrganisationUnit.code;
					$scope.projectcreated=commonvariable.OrganisationUnit.openingDate;
			}
			});
	
	
	// Date datepicker
	  $scope.today = function() {
	    datetoday = new Date();
	    $scope.siteDate=datetoday.getFullYear()+"-"+((datetoday.getMonth()+1)<=9?"0"+(datetoday.getMonth()+1):(datetoday.getMonth()+1))+"-"+(datetoday.getDate()<=9?"0"+datetoday.getDate():datetoday.getDate());
	  };
	  $scope.today();
	  
	  $scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.opened = true;
	  };
	  
	
}]);


