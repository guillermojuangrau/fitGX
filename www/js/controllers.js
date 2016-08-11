angular.module('fitgx.controllers', [])

.controller('OverviewCtrl', function($scope, $rootScope, $localStorage, $window) {


$rootScope.progressPercent = 0;

var date = new Date();
var actualday = ('0' + date.getDate()).slice(-2);
var actualmonth = ('0' + (date.getMonth() + 1)).slice(-2);
var actualyear = date.getFullYear();
$rootScope.FromDate =  (actualday + '/' + actualmonth + '/' + actualyear);

$rootScope.$storage = $localStorage.$default({

    arrayofdata: [

 {
 		"date":[
        {
            "day": actualday,
            "month": actualmonth,
            "year":actualyear
        }
    ],
		"weight":"0",
        "intake":[
        {   
            "name": "Test food",
            "calories": "0"
            
        }
    ],
    "totalintake":"0",
    "exercise":[
        {
            "exercise": "Test exercise",
            "time": "25:00",
            "quantity":"5km"
        }
    ],
        "tobacco":"0",
        "alcohol": "0",
        "color":"green"
}],

settings: [{
    "desiredweight" : "70",
    "intakelimit": "1900",
    "tobaccolimit": "0",
    "alcohollimit": "0"

}]


});


$rootScope.actualsettings = $rootScope.$storage.settings[0];

var testdata = angular.copy($rootScope.$storage.arrayofdata[$rootScope.$storage.arrayofdata.length-1]);


if(testdata.date[0].day!=actualday||testdata.date[0].month!=actualmonth||testdata.date[0].year!=actualyear){
  
    $scope.newDay = {
    "date":[
        {
            "day": actualday,
            "month": actualmonth,
            "year":actualyear
        }
    ],
        "weight":testdata.weight,
        "intake":[
        {   
            "name": "Test food",
            "calories": "0"
            
        }
    ],
    "totalintake":"0",
    "exercise":[
        {
            "exercise": "Test exercise",
            "time": "25:00",
            "quantity":"5km"
        }
    ],
        "tobacco":"0",
        "alcohol": "0",
        "color":"green"
};

    $rootScope.$storage.arrayofdata.push($scope.newDay);
    $rootScope.actualdata = $rootScope.$storage.arrayofdata[$rootScope.$storage.arrayofdata.length-1];
    $rootScope.actualdata.intake.pop();
}else{
    $rootScope.actualdata = $rootScope.$storage.arrayofdata[$rootScope.$storage.arrayofdata.length-1];

}

    




$rootScope.updateCaloricProgress = function(){
    var addedintake = 0;
    for(var i=0;i<$rootScope.actualdata.intake.length;i++){
        addedintake = addedintake*1 + $rootScope.actualdata.intake[i].calories*1;
    }
    $rootScope.actualdata.totalintake = addedintake
    $rootScope.progressPercent =  $window.Math.round((100 * $rootScope.actualdata.totalintake) / $rootScope.actualsettings.intakelimit);
}

$rootScope.updateCaloricProgress();

$rootScope.updateDayColor = function(){
    var score = 0;
    if($rootScope.progressPercent>100){
        score++;
    }
    if($rootScope.actualdata.exercise.length==0){
        score++;
    }
    //FALTA ACTUALIZAR ESTO CON EL LIMITE DE ALCOHOL Y TABACO IMPUESTO
    if($rootScope.actualdata.alcohol>$rootScope.actualsettings.alcohollimit){
        score++;
    }
    if($rootScope.actualdata.tobacco>$rootScope.actualsettings.tobaccolimit){
        score++;
    }
    switch(score){
            case 0:
                $rootScope.actualdata.color="Green";
                $rootScope.updateGraph();
                break;
            case 1:
                $rootScope.actualdata.color="Gold";
                $rootScope.updateGraph();
                break;
            case 2:
                $rootScope.actualdata.color="Orange";
                $rootScope.updateGraph();
                break;
            case 3:
                $rootScope.actualdata.color="OrangeRed";
                $rootScope.updateGraph();
                break;
            case 4:
            $rootScope.actualdata.color="Red";
                $rootScope.updateGraph();
                break;
                           }
        }

})

.controller('DataCtrl', function($scope, $rootScope, $ionicPopup) {

	$rootScope.showPopupWeight = function() {
	$ionicPopup.show({
		template: '<input type="number" ng-model = "actualdata.weight">',
    title: 'Enter your weight',
    subTitle: 'Please enter your weight using a point to indicate decimals',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
        	    return;
                     
        }
      }
    ]


		});

	}

	$rootScope.showPopupTobacco = function() {
	$ionicPopup.show({
		template: '<input type="number" ng-model = "actualdata.tobacco">',
    title: 'Enter number of cigarettes',
    subTitle: 'Please enter the number of cigarettes you have smoked today',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
            $rootScope.updateDayColor();
        	    return;
                     
        }
      }
    ]


		});

	}



})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('IntakeCtrl', function($scope, $rootScope, $ionicPopup, $window) {



$rootScope.removeAlcoholicUnits = function(name) {
        switch(name){
            case 'Beer':
                $rootScope.actualdata.alcohol--;
                $rootScope.updateDayColor();
                break;

            }
        }


$rootScope.deleteIntakeItem = function(item) {
$rootScope.removeAlcoholicUnits(item.name);
$rootScope.actualdata.intake.splice($rootScope.actualdata.intake.indexOf(item), 1);
$rootScope.updateCaloricProgress();
$rootScope.updateDayColor();
}

$rootScope.addIntakeItem = function() {
    $scope.newIntakeItem = {
    id: "",
    name: "",
    calories: ""
};
    $ionicPopup.show({
        template: '<p>Item:</p><input type="text" ng-model = "newIntakeItem.name"> <p>Calories:</p><input type="number" ng-model = "newIntakeItem.calories">',
    title: 'Enter new caloric intake',
    subTitle: 'Please enter the item of food and the calories it has',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
             $rootScope.actualdata.intake.push($scope.newIntakeItem);
             $rootScope.actualdata.totalintake = $rootScope.actualdata.totalintake*1 + $scope.newIntakeItem.calories*1; //If we don't use *1 it will just concatenate the two strings
             $rootScope.updateCaloricProgress();
$rootScope.updateDayColor();    
                return;
                     
        }
      }
    ]


        });
    }

})

.controller('ExerciseCtrl', function($scope, $rootScope, $ionicPopup) {

$rootScope.deleteExerciseItem = function(item) {
$rootScope.actualdata.exercise.splice($rootScope.actualdata.exercise.indexOf(item), 1);
$rootScope.updateDayColor();

}

$rootScope.addExerciseItem = function() {
    $scope.newExerciseItem = {
    id: "",
    exercise: "",
    quantity: "",
    distance: ""
};

    $ionicPopup.show({
        template: '<p>Exercise:</p><input type="text" ng-model = "newExerciseItem.exercise"> <p>Quantity:</p><input type="text" ng-model = "newExerciseItem.quantity"> <p>Time:</p><input type="text" ng-model = "newExerciseItem.time"> ',
    title: 'Enter new exercise',
    subTitle: 'Please enter the exercise and the fields which apply',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
             $rootScope.actualdata.exercise.push($scope.newExerciseItem);
$rootScope.updateDayColor();
                return;
                     
        }
      }
    ]


        });

    }

})

.controller('AlcoholCtrl', function($rootScope, $scope, $ionicPopup) {
    $rootScope.insertAlcohol = function(beverage) {
        switch(beverage){
            case 'Beer':
                $rootScope.actualdata.alcohol++;
                $scope.newIntakeItem = {
                    name: "Beer",
                    calories: "50"
                }; 
                $rootScope.actualdata.intake.push($scope.newIntakeItem);
                $rootScope.updateCaloricProgress();
$rootScope.updateDayColor();
                var alertPopup = $ionicPopup.alert({
                 title: 'Beer added!',
                 template: 'Alcohol units and caloric intake has been updated.'
                 });
                break;

            }


        }

})

.controller('GraphCtrl', function($scope, $rootScope) {

$rootScope.updateGraph = function(){
  $rootScope.dataToPlot = [];
  $rootScope.itemToPush = {
    day: "",
    month: "",
    color: ""
};
  for(var i=($rootScope.$storage.arrayofdata.length-1)*1;i>$rootScope.$storage.arrayofdata.length-31;i--){
  if(i<0){
    break;
  }
  var itemToCopyFrom = angular.copy($rootScope.$storage.arrayofdata[i]);
  $rootScope.itemToPush.day = itemToCopyFrom.date[0].day;
  $rootScope.itemToPush.month = itemToCopyFrom.date[0].month;
  $rootScope.itemToPush.color = itemToCopyFrom.color;
  $rootScope.dataToPlot.push($rootScope.itemToPush);
  
  }
}
$rootScope.updateGraph();



})

.controller('AccountCtrl', function($scope, $rootScope, $ionicPopup) {

$rootScope.settings = $rootScope.$storage.settings;


$rootScope.showPopupDesiredWeight = function() {
    $ionicPopup.show({
        template: '<input type="number" ng-model = "actualsettings.desiredweight">',
    title: 'Enter your desired weight',
    subTitle: 'Please enter your desired weight using a point to indicate decimals',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
                return;
                     
        }
      }
    ]


        });

    }


    $rootScope.showPopupCaloricLimit = function() {
    $ionicPopup.show({
        template: '<input type="number" ng-model = "actualsettings.intakelimit">',
    title: 'Enter your caloric limit',
    subTitle: 'Please enter your caloric limit',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
                return;
                     
        }
      }
    ]


        });

    }


  $rootScope.showPopupTobaccoLimit = function() {
    $ionicPopup.show({
        template: '<input type="number" ng-model = "actualsettings.tobaccolimit">',
    title: 'Enter your tobacco limit',
    subTitle: 'Please enter your tobacco limit',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
                return;
                     
        }
      }
    ]


        });

    }

    $rootScope.showPopupAlcoholLimit = function() {
    $ionicPopup.show({
        template: '<input type="number" ng-model = "actualsettings.alcohollimit">',
    title: 'Enter your alcohol limit',
    subTitle: 'Please enter your alcohol limit in units',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
                return;
                     
        }
      }
    ]


        });

    }

$rootScope.saveData = function(){
$rootScope.$storage.arrayofdata.push($rootScope.actualdata);
}

$rootScope.eraseData = function(){
    delete $rootScope.$storage.arrayofdata;
    delete $rootScope.$storage.settings;
    var alertPopup = $ionicPopup.alert({
                 title: 'Data has been deleted',
                 template: 'fitGX will now exit. Restart the app for the changes to take effect.'
                 });
    alertPopup.then(function(res) {
     navigator.app.exitApp();
   });
    
}




});
