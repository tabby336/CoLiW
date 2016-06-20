var status = 'noSpecial';
var arrowCount = 0;
var reqObj = {};
var newCommand = '';
var newPopUpWindow;
var inputLeft = '';
var inputRigth = '';
var input = '';

var username = 'guest';
var expected_un = '';

var blink = angular.module('blink', [])
    .directive('blink', function($timeout) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        controller: function($scope, $element) {
            function showElement() {
                $element.css("display", "inline");
                $timeout(hideElement, 500);
            }

            function hideElement() {
                $element.css("display", "none");
                $timeout(showElement, 500);
            }
            showElement();
        },
        template: '<span ng-transclude></span>',
        replace: true
    };
});

function sendToServer(queryObj) {
    console.log("lalala");
    $.ajaxSetup({
        async: false
    });
    $.post('/authProviders',queryObj,function(data) {

            if(data.indexOf('Logout succesfully.') > -1) {
                username = 'guest';
                document.getElementById('un').innerText = username;
            }

            if(data.indexOf('Login succesfully.') > -1) {
                username = expected_un.substr(0, expected_un.indexOf('@'));
                document.getElementById('un').innerText = username;
            }

            $('#linie_principala').before('<div class="line">'+data+'</div>');
            $("html, body").animate({ scrollTop: 10000000000 });
        }).fail(function(data) {
            if (data.status === 412) {
                newPopUpWindow = window.open(window.location.href + data.responseText, "DescriptiveWindowName",
    "width=420,height=230,resizable,scrollbars=yes,status=1");
                
    var windowInterval = setInterval(checkIfWindowClosed,500);
                function checkIfWindowClosed() {
                    if(newPopUpWindow.closed) {
                        console.log('eventually closed');
                        sendToServer(queryObj);
                        clearInterval(windowInterval);
                    } else {
                        console.log('not closed yet');
                    }
                };
            }
        });
}

function enterPressed() {
    newCommand = inputLeft + inputRigth;
    username = document.getElementById('un').innerText;
    $('#linie_principala').before('<div class="line">'+ username + ':~$ '+ newCommand + '</div>');
    
    if(newCommand === '') {
        console.log('comanda vida');
        return;
    }

    
    if(newCommand === 'clear') {
        $('.line').remove();  
        inputLeft = '';
        inputRigth = '';      
        return ;
    }



    console.log('dupa if');
    inputLeft = '';
    inputRigth = '';
    arrowCount = 0;
    
    if (status == 'noSpecial' && newCommand.trim().toString() === 'login') {
        username = document.getElementById('un').innerText;

        if(username !== 'guest') {
            status = 'error';
            $('#linie_principala').before('<div class="line">'+ 'Please logout first.' +'</div>');
            $("html, body").animate({ scrollTop: 10000000000 });
        } else {
            status = 'login';
            $('#linie_principala').before('<div class="line">'+ 'Please enter your username.' +'</div>');
            $("html, body").animate({ scrollTop: 10000000000 });
            return;
        }
        
    }

    if (status === 'noSpecial' && newCommand.trim().toString() === 'register') {
        username = document.getElementById('un').innerText;
        
        if(username !== 'guest') {
            status = 'error';
            $('#linie_principala').before('<div class="line">'+ 'Please logout first.' +'</div>');
            $("html, body").animate({ scrollTop: 10000000000 });
        } else {
            status = 'register';
            $('#linie_principala').before('<div class="line">'+ 'Please enter your username.' +'</div>');
            $("html, body").animate({ scrollTop: 10000000000 });
            return;
        }
    }

    switch (status) {
        case 'noSpecial': console.log('noua comanda');sendToServer({cmd: newCommand}); break;
        case 'login': 
            expected_un = newCommand;
            reqObj = {cmd: 'login', un: newCommand}; 
            status = 'loginPassword'; 
            $('#linie_principala').before('<div class="line">'+ 'Please enter your password.' +'</div>');
            $("html, body").animate({ scrollTop: 10000000000 });
        break;
        case  'loginPassword': 
            status = 'noSpecial';
            reqObj.pw = newCommand; 
            $("#command").attr('type', 'text'); 
            sendToServer(reqObj); 
        break;
        case 'register':
            reqObj = {cmd: 'register', un: newCommand};
            status = 'registerPassword'; 
            $('#linie_principala').before('<div class="line">'+ 'Please enter your password.' +'</div>');
            $("html, body").animate({ scrollTop: 10000000000 });
        break;
        case 'registerPassword':
            reqObj.pw = newCommand;
            status = 'registerVerifyPassword'; 
            $('#linie_principala').before('<div class="line">'+ 'Please retype your password.' +'</div>');
            $("html, body").animate({ scrollTop: 10000000000 });

        break;
        case 'registerVerifyPassword':
            reqObj.vpw = newCommand;
            status = 'noSpecial';
            $("#command").attr('type', 'text');
            sendToServer(reqObj); 
        break;
        case 'error': status = 'noSpecial'; break;
    }
}


function replaceWithStars(input) {
    var replacedInput = '';
    for (var i = 0; i < input.length; i++) {
        replacedInput = replacedInput + '*';
    }   
    return replacedInput;
}

function printCommand() {
    if (status == 'loginPassword' || status == 'registerPassword' || status == 'registerVerifyPassword') {
        var replacedInputLeft = replaceWithStars(inputLeft);
        var replacedInputRigth = replaceWithStars(inputRigth);
        $('#inputLeft').text(replacedInputLeft);
        $('#inputRigth').text(replacedInputRigth);
    } else {
        $('#inputRigth').text(inputRigth);
        $('#inputLeft').text(inputLeft);
    }
}

function getCommandFromHistory() {
    var queryObj = {number: arrowCount};
    $.ajaxSetup({
        async: false
    });
    console.log(queryObj);
    $.post('/history',queryObj,function(data) {
        inputLeft = data;
        inputRigth = '';
    }).fail(function(data) {
    });
}

function arrowPressed(arrow) {
    switch (arrow) {
        case 'ArrowRight':
            if (inputLeft == undefined) {inputLeft = ''};
            if (inputRigth.length > 0) {
                inputLeft = inputLeft + inputRigth[0] ; 
                inputRigth = inputRigth.substring(1, inputRigth.length);
            } break;
        case 'ArrowLeft': 
            if (inputRigth == undefined) {inputRigth = ''};
            if (inputLeft.length > 0) {
                inputRigth = inputLeft[inputLeft.length - 1] + inputRigth ; 
                inputLeft = inputLeft.substring(0, inputLeft.length - 1);
            } break;
        case 'ArrowUp':
            ++arrowCount; 
            getCommandFromHistory();
            break;
        case 'ArrowDown':
            if (arrowCount > 0) {
                --arrowCount; 
            }
            getCommandFromHistory();
            break;
    }
}

function arrowRight() {
    if (inputLeft == undefined) {inputLeft = ''};
    if (inputRigth.length > 0) {
        inputLeft = inputLeft + inputRigth[0] ; 
        inputRigth = inputRigth.substring(1, inputRigth.length);
    } 
}

function arrowLeft() {
    if (inputRigth == undefined) {inputRigth = ''};
    if (inputLeft.length > 0) {
        inputRigth = inputLeft[inputLeft.length - 1] + inputRigth ; 
        inputLeft = inputLeft.substring(0, inputLeft.length - 1);
    } 
}

function arrowUp() {
    ++arrowCount;
    getCommandFromHistory();
    if(inputLeft === '') {
        --arrowCount;
    }
}

function arrowDown() {    
    getCommandFromHistory();
    if (arrowCount > 0) {
        --arrowCount; 
    }
}


$(document).on('keydown', function(event) {
    event = event || window.event;
    var charCode = event.keyCode || event.which;
    switch (charCode) {
        case 8: inputLeft = inputLeft.substring(0, inputLeft.length - 1); break;
        case 13: enterPressed(); break;
        case 37: arrowLeft();break;
        case 38: arrowUp(); break;
        case 39: arrowRight(); break;
        case 40: arrowDown();  break;
    }
    printCommand();
});

$(document).on('keypress', function(event) {
    event = event || window.event;
    var charCode = event.keyCode || event.which;
    if (charCode != 8 && charCode != 13 && charCode != 37  && charCode != 38  && charCode != 39  && charCode != 40 ) {
        if (!event.ctrlKey) {
            inputLeft = inputLeft + String.fromCharCode(event.which); 
            printCommand();
        } 
    }
});

document.addEventListener("paste", function (e) {
    var pastedText = undefined;
    if (window.clipboardData && window.clipboardData.getData) { // IE
        inputLeft = inputLeft + window.clipboardData.getData('Text');
    } else if (e.clipboardData && e.clipboardData.getData) {
        inputLeft = inputLeft + e.clipboardData.getData('text/plain');
    }
    printCommand();
});

$(document).on('click', function() {
    $('input').focus();
});