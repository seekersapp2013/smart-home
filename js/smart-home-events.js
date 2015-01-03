// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// SHOW LEDs Menu
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var led_transmitter = null
,   led_id          = 0;

PUBNUB.events.bind( 'click.leds', function(event) {
    console.log('LEDs');

    // Show Sub Menu (Lights/LEDs)
    show_submenu('light-menu');

    // Start Signal Emitter
    //clearInterval(led_transmitter);
    //led_transmitter = setInterval( transmit_led, 500 );

    // Hide Main Menu
    hide_menu(event);

} );

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Transmit LED Settings
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var transmit_led = PUBNUB.updater( function() {
    PUBNUB.events.fire( 'send-iot-signal', {
        ledID          : +led_id,
        minPulseLength : +PUBNUB.$('min-pulse').value,
        maxPulseLength : +PUBNUB.$('max-pulse').value,
        waitFloor      : +PUBNUB.$('min-wait').value,
        waitCeiling    : +PUBNUB.$('max-wait').value
    } );
}, 500 );

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// LED SLIDER Settings
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var ledlights = PUBNUB.$('light-menu').getElementsByTagName('input');
PUBNUB.each( ledlights, function(light) {
    PUBNUB.bind( 'touchmove,mousemove', light, function(e) {
        transmit_led();
        return true;
    } );
} );

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// SHOW Open Door Menu
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
PUBNUB.events.bind( 'click.door', function(event) {
    console.log('Open/Close Door');

    // Hide Main Menu
    hide_menu(event);

} );

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// ADVANCED Menu
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
PUBNUB.events.bind( 'click.conf', function(event) {
    console.log('Clicked Debug');

    // Hide Main Menu
    hide_menu(event);

} );

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// LIGHT Selection and Management
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
PUBNUB.events.bind( 'click.light-select', function(event) {
    console.log( 'LIGHT SELECT', event );

    var lights = PUBNUB.$('light-selector').getElementsByTagName('div');

    play('click-sound');

    // Set the targeted LED
    led_id = +event.data;
    transmit_led();

    PUBNUB.each( lights, function(light) {
        if (PUBNUB.attr( light, 'data-value' ) == event.data)
            light.className = "light-select light-selected";
        else
            light.className = "light-select light-unselected";
    } );
} );

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// LIGHT Ragne Selectors
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
PUBNUB.events.bind( 'click.light-slider', function(event) {
    console.log(event);
} );

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Show/Hide Sub Menu
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function show_submenu(menu) {
    console.log( 'Showing', menu );

    PUBNUB.$(menu).className = "sub-menu-visible";
}
function hide_submenu(menu) {
    PUBNUB.$(menu).className = "sub-menu";
}
function hide_all_submenus() {
    PUBNUB.each( [
        'light-menu',
        'debug-menu',
        'door-menu'
    ], hide_submenu );
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Hide Main Menu
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function hide_menu(event) {
    console.log(event);


    play('click-beep-sound');

    if (hide_menu.invisible) {
        hide_menu.invisible = false;
        setTimeout( function(){ PUBNUB.events.fire('show-menu') }, 1 );
        //clearInterval(led_transmitter);
        return hide_all_submenus();
    }
    else {
        hide_menu.invisible = true;
        setTimeout( function(){ PUBNUB.events.fire('hide-menu') }, 1 );
    }

    0&&animate( PUBNUB.$("octo-"+event.data+"-indicator"), [
        { 'd' : 0.2, 'r' : 10, 'opacity' : '0.5' },
        { 'd' : 0.2 }
    ] );

    0&&animate( PUBNUB.$("octo-"+event.data), [
        { 'd' : 0.2, 'r' : -10 },
        { 'd' : 0.8 }
    ] );

}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Play Sounds
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function play(sound) {
    try      { PUBNUB.$(sound).play() }
    catch(e) { }
}

