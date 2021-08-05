#include <stdio.h>
#include <gb/gb.h>
#include <gb/console.h>
#include <string.h>
#include "tiles.h"

#define BYTE unsigned char

void main()
{

    DISPLAY_OFF;
    SHOW_BKG;
    set_tile_data(0, 3, TileLabel, 0x90);
    // set_bkg_tile_xy(0,0,0);
    // set_bkg_tile_xy(0,1,1);
    // set_bkg_tile_xy(0,2,2);
    DISPLAY_ON;

    while (TRUE)
    {
        wait_vbl_done();
    }
}