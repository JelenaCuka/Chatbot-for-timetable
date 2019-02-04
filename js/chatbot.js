var session;
var mt = '<strong>BOT:</strong><br>';
var divr = '<div class="request">';
var loginStaus = false;
var registerStaus = false;

var defaultOdgovori = ["Ne znam ni ja odgovore na sva pitanja :(", "Ne razumijem te :(", "Pitaj me nešto što znam","Ne znam","Pitaj me o rasporedu","Ne znam odgovoriti na nejasna pitanja"];

window.onload = function () { 
    session = pl.create();
    if(session){
        session.consult( "baza.pl" );
        console.log("load baza.pl");
    }
}

$(document).ready(function(e) {
    $("#buttonPrijava").click(function(e) {
        loginStaus = false;
        $("#errorLogin").text("");
        var noviUser = $("#usernameLogin").val();
        if (noviUser != ""){
            //session = pl.create();
            if(session){
                //session.consult( "baza.pl" );
                //var query = 'korime(ivo).';
                var query = "login("+noviUser+").";
                console.log(query);
                session.query( query );
                session.answers(login(), 1000);
                if( loginStaus != false){
                    setCookie("username", noviUser, 10);
                    $("#errorLogin").text("uspjesna prijava "+getKorime());
                    console.log(getKorime());
                }else{
                    $("#errorLogin").text("Neispravna prijava "+$("#usernameLogin").val());
                    document.cookie = "username="+"; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
                }
                $("#usernameLogin").val("");
            }
        }else{
            $("#errorLogin").text("Unesite korisničko ime!!!");
            document.cookie = "username="+"; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
        }
    });
    $("#buttonRegistracija").click(function(e) {
        registerStaus = false;
        $("#greskaRegistracija").text("");
        var noviUser = $("#registerUsername").val();
        if (noviUser != ""){
            //ako ovdje odkomentiram onda se novododani mogu ponovo dodati odnosno prilikom reconsulta obrisu se napravljene promjene
            //session = pl.create();
            if(session){
                session.consult( "baza.pl" );
                var query = "registrirajKorisnika("+noviUser+").";
                session.query( query );
                //session.answers(register(), 1000);
                var callback = register();
                session.answer(callback);
                if( registerStaus != false){
                    $("#greskaRegistracija").text("Uspješna registracija "+ $("#registerUsername").val());
                    
                }else{
                    $("#greskaRegistracija").text("Neuspješna registracija "+ $("#registerUsername").val());
                }
                $("#registerUsername").val("");
            }

        }else{
            $("#greskaRegistracija").text("Unesite korisničko ime!!!");
        }
    });
    
    
});
$(document).keypress(function(e) {
  if (e.which == 13) {
    //bot(); 
    //collect question
   
    ////write question
    addUserQuestion();
    //clear input
    var userQuestion = document.getElementById("mesbox").value;
    clearInputBox();
    addBotAnswer(userQuestion);
    //write answer
    $("#chatBox").scrollTop($("#chatBox")[0].scrollHeight);
  }
   //$(document).find('#chatBox').append(html);
     // var question = $(this).val('');
      //$(document).find('#chatBox').append(question)
});
//PROLOG RESPONSE
function login() {
	return function(answer) {
            
		if(pl.type.is_substitution(answer)) {
                    console.log('login function');
                    loginStaus = true;
		}else{
                    loginStaus = false;
                }
	};
}
function register() {
	return function(answer) {
            console.log('register function');
            console.log(answer);
		if(pl.type.is_substitution(answer)) {
                        if(answer!=false){
                            registerStaus = true;
                        }
		}
	};
}
//LOGIN
function getKorime(){
    return getCookie("username");
}
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function delete_cookie( name ) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
function deleteCookie(name) {
        setCookie({name: name, value: "", seconds: 1});
    }

function ulogiran() {
  var user = getCookie("username");
  if (user != "") {
    currentUser = user;
    return true;
  } else {
    return false;
    }
}

/*
var botOdgovara = function (Odgovor){
            if(Odgovor!=""){
                var botAnswer = '<div class=\"response\">' +'<strong>BOT:</strong><br>' + Odgovor + '</div>';
                $( "#chatBox" ).append(botAnswer);
            }
}
function reply (answer){
    console.log(answer);
}*/
function addBotAnswer(questionToAnswer){
    botNijeOdgovorio=true;
    if (getCookie("username")!=""){
         var pitanje = questionToAnswer;
        console.log(pitanje);
        var formatPitanje=formatirajString(pitanje);
        var imaLiPitanja = formatPitanje.split(",");
        var query = 'findall(X ,nalaziSeUObje(X,['+formatPitanje +'], [danas,sutra,raspored,pon,uto,sri,cet,pet,dodaj,novi]),L).';
        session.query( query );
        session.answer(pitanja(imaLiPitanja), 1000);
        odgovor='';
        if(botNijeOdgovorio){
            var odgovor = defaultOdgovori[getRndInteger(0,defaultOdgovori.length)];
            var botAnswer = '<div class=\"response\">' + mt + odgovor + '</div>';
            $( "#chatBox" ).append(botAnswer);
        }
    }
}
function raspored(dan) {
	return function(answer) {
            if(!answer){
                var botAnswer = '<div class=\"response\">'+ mt +dan +'Ti si Free' + '</div>';
                $( "#chatBox" ).append(botAnswer);
                botNijeOdgovorio = false;
            }
        if(pl.type.is_substitution(answer)) {
                        console.log(answer.lookup("SviR"));
                        var botAnswer = '<div class=\"response\">' + mt+dan +': '+ answer.lookup("SviR").toString() + '</div>';
                        $( "#chatBox" ).append(botAnswer);
                        $("#chatBox").scrollTop($("#chatBox")[0].scrollHeight);
                        botNijeOdgovorio = false;
		}
        botNijeOdgovorio=false;
	};
        
}
function predmetTrazi(dan) {
        console.log("predmet search");
	return function(answer) {
            if(!answer){
                var botAnswer = '<div class=\"response\">'+ mt +dan +'Ti si Free' + '</div>';
                $( "#chatBox" ).append(botAnswer);
                botNijeOdgovorio = false;
            }
        if(pl.type.is_substitution(answer)) {
                        console.log(answer);
                        if(answer.lookup("SviR").args.length != 0){
                            var botAnswer = '<div class=\"response\">' + mt+dan +': '+ answer.lookup("SviR").toString() + '</div>';
                            $( "#chatBox" ).append(botAnswer);
                            $("#chatBox").scrollTop($("#chatBox")[0].scrollHeight);
                            botNijeOdgovorio = false;
                        }
		}
	};
        
}
function dodaj(a) {
    console.log("dodajFunction");
	return function(answer) {
		if(pl.type.is_substitution(answer)) {
                        if(answer!=false){
                            var botAnswer = '<div class=\"response\">' + mt+ answer + '</div>';
                            $( "#chatBox" ).append(botAnswer);
                        }
		}else{
                    loginStaus=false;
                }
	};
}
function pitanja(pitanja) {
	return function(answer) {
            console.log("PITANJA FUNCTION");
            console.log(answer);
		if(pl.type.is_substitution(answer)) {
                        var l = answer.lookup("L");                      
                        if( l.args.length!=0){
                        resultD = [];
                        while( l  ){
                                if(l.args[0].id === undefined) break;
                                console.log(l.args[0].id);
                                    switch(l.args[0].id) {
                                        case 'raspored':
                                            var query = 'findall(R,danRaspored('+getKorime()+',X,R),SviR).';    
                                            session.query( query );
                                            session.answer(raspored('cijeli raspored'), 1000);
                                            break;
                                        case 'danas':
                                        var query = 'findall(R,danRaspored('+getKorime()+','+getDay()+',R),SviR).';    
                                        session.query( query );
                                        session.answer(raspored(getDay()), 1000);break;
                                        case 'sutra': 
                                            var query = 'findall(R,danRaspored('+getKorime()+','+nextDay()+',R),SviR).';  
                                            session.query( query );
                                            session.answer(raspored(nextDay()), 1000);break;
                                        break;
                                        case 'pon':
                                            var query = 'findall(R,danRaspored('+getKorime()+','+'pon'+',R),SviR).';   
                                            session.query( query );
                                            session.answer(raspored('pon'), 1000);
                                            break;
                                        case 'uto': 
                                            var query = 'findall(R,danRaspored('+getKorime()+','+'uto'+',R),SviR).';     
                                            session.query( query );
                                            session.answer(raspored('uto'), 1000);
                                    break;
                                        case 'sri': 
                                            var query = 'findall(R,danRaspored('+getKorime()+','+'sri'+',R),SviR).';     
                                            session.query( query );
                                            session.answer(raspored('sri'), 1000);
                                    break;
                                        case 'cet': 
                                            var query = 'findall(R,danRaspored('+getKorime()+','+'cet'+',R),SviR).';   
                                            session.query( query );
                                            session.answer(raspored('cet'), 1000);
                                            break;
                                        case 'pet': 
                                            var query = 'findall(R,danRaspored('+getKorime()+','+'pet'+',R),SviR).';  
                                            session.query( query );
                                            session.answer(raspored('pet'), 1000);
                                            break;
                                        case 'dodaj': 
                                            //dohvati sve 
                                            //ako su svi popunjeni
                                            //dodaj
                                            var predmet = document.getElementById("predmet").value;
                                            var dvorana = document.getElementById("dvorana").value;
                                            var od = document.getElementById("od").value;
                                            var Do = document.getElementById("do").value;
                                            var zgrada = document.getElementById("zgrada").value;
                                            var dan = document.getElementById("dann").value;
                                            if(predmet!=""&&dvorana!=""&&od!=""&&Do!=""&&zgrada!=""&&dan!=""){
                                                var q = 'dodajTermin('+od+','+Do+','+dvorana+','+zgrada+','+predmet+','+dan+','+getKorime()+').';
                                                console.log(q);     
                                                session.query( q );
                                                session.answer(dodaj("d"), 1000);
                                                //var query = 'findall(R,danRaspored('+getKorime()+',pet,R),SviR).';
                                                //session.query( query );
                                                //session.answer(raspored('pet'), 1000);
                                            }else{
                                                var odgovor = "Za dodavanje u raspored ispuni sva polja :D";
                                                var botAnswer = '<div class=\"response\">' + mt + odgovor + '</div>';
                                                $( "#chatBox" ).append(botAnswer);
                                                $("#chatBox").scrollTop($("#chatBox")[0].scrollHeight);
                                            }
                                            break;
                                        default: 
                                            var odgovor = defaultOdgovori[getRndInteger(0,defaultOdgovori.length)];
                                            var botAnswer = '<div class=\"response\">' + mt + odgovor + '</div>';
                                            $( "#chatBox" ).append(botAnswer);
                                            $("#chatBox").scrollTop($("#chatBox")[0].scrollHeight);
                                  }
                            console.log(l.args[0].id);
                            resultD.push(l.args[0].id.toString()  );
                            //console.log(l.args[0].id);
                            l=l.args[1];
                            
                        }
                        }else{
                            console.log("ne zna");
                            /*TRAZI PREDMET*/
                                            for (i = 0; i < pitanja.length; i++) {
                                                console.log(pitanja[i]);
                                                var query = 'findall(R,danRasporedPredmet('+getKorime()+','+'X'+',R,'+pitanja[i]+'),SviR).';
                                                console.log(query);    
                                                session.query( query );
                                                session.answer(predmetTrazi('Predmet tražiš? '), 1000);
                                            }
                            
                        }
		}
                
	};
}

//dodavanje pitanja
function addUserQuestion(){
    var input = document.getElementById("mesbox").value;
    var currentUser = getCookie("username");
    var us = '<strong>'+currentUser+'</strong><br>';
    if(input!=""){
        if(currentUser!=""){
            var userQuestion = '<div class=\"request\">'+us + input + '</div>';
            $( "#chatBox" ).append(userQuestion);
        }else{
            var botAnswer = '<div class=\"response\">' + mt + 'Ulogirajte se ili registrirajte za nastavak' + '</div>';
            $( "#chatBox" ).append(botAnswer);
        }
    }
}

//ocisti input
function clearInputBox(){
    document.getElementById("mesbox").value = ""; 
}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}
function formatirajString(ulazniString){
    var res = ulazniString.trim();
   
    for (i = 0; i < res.length; i++) {
        res = res.replace("!", ",");
        res = res.replaceAll("?", "");
        res = res.replaceAll("/", "");
        res = res.replaceAll("$", "");
        res = res.replaceAll(",", "");
        res = res.replaceAll("%", "");
        res = res.replaceAll("&", "");
        res = res.replaceAll("#", "");
        res = res.replaceAll("(", "");
        res = res.replaceAll(")", "");
        res = res.replaceAll(".", "");
    }
    for (i = 0; i < res.length; i++) {
        res = res.replace(" ", ",");
    }
    res = res.replaceAll("/\s/g", ",");
    //res = "["+res+"]";
    res = res.toLowerCase();
    return res;
}
String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 
function getDay(){
    var d = new Date();
    var n = d.getDay();
    var dan;
    switch(n) {
            case 1: dan="pon";break;
            case 2: dan="uto";break;
            case 3: dan="sri";break;
            case 4: dan="cet";break;
            case 5: dan="pet";break;
            default: dan=pon;
      }
      return dan;
}
function nextDay(){
    var d = new Date();
    var n = d.getDay();
    var dan;
    switch(n+1) {
            case 1: dan="pon";break;
            case 2: dan="uto";break;
            case 3: dan="sri";break;
            case 4: dan="cet";break;
            case 5: dan="pet";break;
            default: dan=pon;
      }
      return dan;
}
function getHour(){
    var d = new Date();
    return d.getHours();
}