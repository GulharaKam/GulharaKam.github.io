var app = angular.module("myApp", ["ngRoute",  "toastr", "ui.uploader"])
    .run(function($rootScope, $http, $location) {
        $rootScope.sessionData = {};
        $rootScope.profile = function() {
        }

        $rootScope.logout = function() {
        }
    });

app.config(function ($routeProvider) {
    $routeProvider
        .when("/requestclient", {
            templateUrl: "views/requestclient.html",
            controller: "requestclientController"
        })
        .when("/activityreport", {
            templateUrl: "views/activityreport.html",
            controller: "activityreportController"
        })
        .when("/profile", {
            templateUrl: "views/profile.html",
            controller: "profileController"
        })
        .when("/main", {
            templateUrl: "views/main.html",
            controller: "mainController"
        })
        .when("/login", {
            templateUrl: "views/login.html",
            controller: "loginController"
        })
        .otherwise({
            redirectTo: 'main',
        });

});

app.filter('type', function () {
    return function (input) {
        var ext = input.split('.').pop();
        if (['jpg', 'jpeg', 'png', 'bmp'].includes(ext)) return 'image';
        if (['doc', 'docx'].includes(ext)) return 'msword';
        if (['xls', 'xlsx'].includes(ext)) return 'msexcel';
        if (['pdf'].includes(ext)) return 'pdf';
    };
});

app.controller('mainController', function($scope, $rootScope) {
    $rootScope.profile();
});

app.controller('requestclientController', function ($scope, $rootScope, $http, toastr, $filter, uiUploader) {
    $rootScope.profile();
});

app.controller('activityreportController', function ($scope, $rootScope, $http, toastr, uiUploader, $timeout, $filter, $window) {
    $rootScope.profile();

$scope.closeEditor = function() {
    $scope.showEditor = false;
}

$scope.openEditor = function(req) {
    $scope.showEditor = true;
    $scope.selectedevent=[];
    $scope.selectedevent=angular.copy(req);
    $scope.selectedevent.datetime =new Date($scope.selectedevent.datetime);
};

$scope.saveChanges = function() {
};


$scope.sendMail = function(){
};

$scope.showwriter = false;
$scope.openWriter = function(id) {
    $scope.showwriter = true;
    $scope.history={};
    var historydata=[];
    $scope.historypurchase={};
    
   $http.get("http://localhost:777/eventhistory/" + id).then(function(data) {
        $scope.history = data.data; 
       angular.forEach($scope.history, function(writer, writer_id){
         angular.forEach(writer, function(writernote, writernote_id){
            historydata.push({"datetime":writernote.inputdate, "text":writernote.text, 
            "price":writernote.price, "inputtime":writernote.inputdatetime});
        });
    });
    $scope.historypurchase=historydata;
});
};

$scope.closewriter = function() {
    $scope.showwriter = false;
}

$scope.openHistory = function(req) {
    $scope.showHistory = true;
    $scope.eventhistory={};
    var historydata=[];
    $scope.historyevent={};
    $http.get("http://localhost:777/eventstatus/" + req.id).then(function(data) {
        $scope.eventhistory = data.data;
        angular.forEach($scope.eventhistory, function(history, history_id){
            angular.forEach(history, function(historynote, historynote_id){
            historydata.push({"datetime":historynote.inputtimedate, 
            "comment":historynote.comment, "workstatus":historynote.workstatus, "writer":historynote.writer});
        });
    });
    $scope.historyevent=historydata;  
});

};

$scope.closeHistory = function() {
    $scope.showHistory = false;
};

$scope.ReadStatus = function(req) {
    if(req.read == 1)
            return;
    $scope.selectedwriter=req;
    $http.post("http://localhost:777/redstatus", $scope.selectedwriter, {withCredentials: true}).then(function(data) {
        toastr.success('Вы прочитали заявку', 'Прочитано!');
     }, function(data) {
         toastr.error('Заявка не прочитана', 'Ошибка!');
     })
};

$scope.resetFilters = function() {
    $scope.filters = {};
    $scope.filter_date_from = null;
    $scope.filter_date_to = null;
    $scope.filter_date = null;
    $scope.showFilters = false;
}


function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "Report";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};




$scope.eventscv={};
$scope.eventsscv=[];
$scope.createcsv = function(){
    $scope.filters.filter_date_from = $filter('date')($scope.filter_date_from, "yyyy-MM-dd HH:mm:ss");
    $scope.filters.filter_date_to = $filter('date')($scope.filter_date_to, "yyyy-MM-dd HH:mm:ss");
    $http.post("http://localhost:777/eventscv", $scope.filters).then(function(data) {
        $scope.eventscv = data.data;
        var eventscv=[];
        angular.forEach($scope.eventscv, function(event, event_id){
            angular.forEach(event, function(eventnote, eventnote_id){
            eventscv.push({"id":eventnote.id, "time_client":eventnote.inputdatetime,
            "text":utf8_decode(eventnote.text), "client":utf8_decode(eventnote.displayname), "workstatus":utf8_decode(eventnote.name),
            "comment":utf8_decode(eventnote.comment), "sender":utf8_decode(eventnote.writer), "time_sender":eventnote.outputdatetime});
        });
    });
    $scope.eventsscv=eventscv;
    JSONToCSVConvertor($scope.eventsscv, ' ', true);
    });
    
};
});

app.controller('loginController', function($scope, $rootScope, $http, $rootScope, $location) {
    $rootScope.profile();
  
    if ($rootScope.loggedIn)
        $location.path("main");
     
    $scope.email = "ermek.moldashev@kazgor.kz";
    $scope.password = "123456";
    $scope.showAlert = false;
    $scope.login = function() {
        $http.post("http://localhost:777/login", {
            "email": $scope.email,
            "password": $scope.password
        }, {withCredentials: true}).then(function(data) {
            $scope.showAlert = false;
            $rootScope.sessionData = data.data;
            $rootScope.loggedIn = true;
            $location.path("main");
        }, function() {
            $scope.showAlert = true;
        });
    }
});
app.controller('profileController', function($scope, $http, toastr) {
    $scope.profileinfo = {};
    $scope.profileinfouser = [];
    $http.get("http://localhost:777/user/info", {withCredentials: true}).then(function(data) {
        $scope.profileinfo = data.data;
            angular.forEach($scope.profileinfo, function(profile, profile_id){
                angular.forEach(profile, function(person, person_id){
                    $scope.profileinfouser.name=person.name;
                    $scope.profileinfouser.surname=person.surname;
                    $scope.profileinfouser.displayname=person.displayname;
                    $scope.profileinfouser.email=person.email;
            });
        });
    });

    $scope.credentials = {};
    $scope.credentials.password = null;
    $scope.credentials.newPassword = null;
    $scope.credentials.repeatNewPassword = null;
    $scope.changePassword = function() {
        if ($scope.credentials.newPassword != $scope.credentials.repeatNewPassword) {
            toastr.warning("Введенные пароли не совпадают!", "Warning");
            return;
        }
        if ($scope.credentials.newPassword.trim().length < 6) {
toastr.warning("Пароль должен быть длиной минимум 6 символов!", "Warning");
return;
        }
        $http.post("http://localhost:777/user/password", $scope.credentials, {withCredentials: true}).then(function(data) {
            $scope.profile = data.data;
            toastr.success("Пароль успешно изменен!", "Success");
}, function() {
            toastr.error("Возникли проблемы при смене пароля!", "Error");
        })
    }
});

