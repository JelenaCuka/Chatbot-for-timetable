%ovo nema smisla ovdje drzati ali previse problema s ucitavanjem pl datoteka ne znam zasto katastrofa
:-use_module(library(lists)).
:- use_module(library(dom)).
:- use_module(library(js)).

:- dynamic(korime/1).
:- dynamic(korisnik/3).
:- dynamic(dvorana/1).
:- dynamic(zgrada/1).

dan('pon').
dan('uto').
dan('sri').
dan('cet').
dan('pet').

zgrada('foi1').
zgrada('foi2').

dvorana('1').
dvorana('2').
dvorana('3').
dvorana('4').
dvorana('5').
dvorana('6').
dvorana('7').
dvorana('8').
dvorana('9').
dvorana('10').
dvorana('11').
dvorana('12').
dvorana('13').
dvorana('14').
dvorana('15').

postojiZgrada(X):- zgrada(X).
postojiDvorana(X):- dvorana(X).
postojiDan(X):- dan(X).
jeBroj(X):- number(X), X >= 0 , X =< 24.

%testni korisnici
korime(ivo).
korime(ana).
%unos rasporeda za testne korisnike
korisnik(ivo, [termin(8,10,1,foi2,lp), termin(12,14,2,foi2,air),termin(14,16,1,foi2,os2), termin(19,20,2,foi1,air)],pon).
korisnik(ivo,[termin(9,10,1,foi1,lp)],uto).
korisnik(ivo,[termin(10,11,1,foi2,programiranje), termin(11,15,2,foi2,informatika)],sri).
korisnik(ivo,[],cet).
korisnik(ivo,[termin(8,10,1,foi1,lp), termin(12,14,2,foi2,air)],pet).

korisnik(ana, [termin(8,10,1,foi2,tjelesni), termin(12,14,2,foi2,matematika),termin(14,16,1,foi2,fizika), termin(19,20,2,foi1,'neki predmet')],pon).
korisnik(ana,[termin(9,10,1,foi1,lp),termin(10,11,1,foi2,'operacijski sustavi dva labosi')],uto).
korisnik(ana,[termin(10,11,1,foi2,'operacijski sustavi dva'), termin(11,15,2,foi2,informatika)],sri).
korisnik(ana,[termin(8,10,1,foi1,'opet tjelesni'), termin(12,14,2,foi2,air),termin(14,16,1,foi2,'teorija baza podataka')],cet).
korisnik(ana,[],pet).

%odgovoriNaPitanje(X):-
    %apply(botOdgovara, X, Odgovor).

%apply(botOdgovara,[neki,odgovor,je,ovo], Odgovor).

not(P) :- call(P), !, fail.
not(P). 

registrirajKorisnika(NovoKorime) :-
    not(korime(NovoKorime)),
    assertz(korime(NovoKorime)),
    assertz(korisnik(NovoKorime,[],pon)),
    assertz(korisnik(NovoKorime,[],uto)),
    assertz(korisnik(NovoKorime,[],sri)),
    assertz(korisnik(NovoKorime,[],cet)),
    assertz(korisnik(NovoKorime,[],pet)).

%ovo nesto radi
%korisnik(ana,[G|T],pon),arg(1,G,Od),arg(2,G,Do),arg(3,G,Dvorana),arg(4,G,Zgrada),arg(5,G,Predmet).
%dovatiRasporedDan(Korisnik,Dan):-korisnik(Korisnik,[G|T],Dan),arg(1,G,Od),arg(2,G,Do),arg(3,G,Dvorana),arg(4,G,Zgrada),arg(5,G,Predmet).
%ispis(Dan,G):-arg(1,G,Od),arg(2,G,Do),arg(3,G,Dvorana),arg(4,G,Zgrada),arg(5,G,Predmet),ISPIS=[Dan,' imas ',Predmet,' od ',Od,' do ',Do,' u dvorani ',Dvorana,', zgrada ',Zgrada ].
%korisnik(ana,[G|T],pon),arg(1,G,Od),arg(2,G,Do),arg(3,G,Dvorana),arg(4,G,Zgrada),arg(5,G,Predmet),ISPIS=[pon,' imas ',Predmet,' od ',Od,' do ',Do,' u dvorani ',Dvorana,', zgrada ',Zgrada ].

%nananananananan

login(Korime) :-korime(Korime).

%korisnik(ana,[G|T],pon),ispis(pon,G,ISPIS).

ispisiSveDan([],_,IspisCiliDan).
ispisiSveDan([Termin|Ostatak],PocetniIspis,IspisCiliDan):-ispis(pon,Termin,IspisJedanTerminUDanu),append(IspisJedanTerminUDanu,PocetniIspis,IspisCiliDan),ispisiSveDan([Ostatak],IspisCiliDan,IspisCiliDan).

%ovo radi s pozivom korisnik,ispis ispis termina je ovo
ispis(Dan,G,ISPIS):-arg(1,G,Od),arg(2,G,Do),arg(3,G,Dvorana),arg(4,G,Zgrada),arg(5,G,Predmet),ISPIS=[Dan,' imas ',Predmet,' od ',Od,' do ',Do,' u dvorani ',Dvorana,', zgrada ',Zgrada ].
nalaziSeUObje(Rijec,Pitanje,DobraPitanja):-member(Rijec,Pitanje),member(Rijec,DobraPitanja).    
ispisiSve(Dan,Svi,I):-member(X,Svi),ispis(Dan,X,I).
danRaspored(Korime,Dan,Izlaz):-korisnik(Korime,P,Dan),member(X,P),ispis(Dan,X,Izlaz).

danRasporedPredmet(Korime,Dan,Izlaz,Predmet):-korisnik(Korime,P,Dan),member(X,P),arg(5,X,Predmet),ispis(Dan,X,Izlaz).

preklapanje(Od,Do,termin(NOd,NDo,_,_,_)) :- (Od =< NOd) , (Do >= NDo).
%@=<(Od,NOd) ,@=>(Do,NDo)

nemaPreklapanja([],_,_).
nemaPreklapanja([G|R], Od,Do):-
	nemaPreklapanja(R,Od,Do),
    not(preklapanje(Od,Do,G)).

dodajTermin(Od,Do,Dvorana,Zgrada,Predmet,Dan,Korime) :- 
    korisnik(Korime,Raspored,Dan),
    nemaPreklapanja(Raspored,Od,Do),
    append([termin(Od,Do,Dvorana,Zgrada,Predmet)],Raspored,NoviRaspored),
    retract(korisnik(Korime,Raspored,Dan)),
    assertz(korisnik(Korime,NoviRaspored,Dan)). 