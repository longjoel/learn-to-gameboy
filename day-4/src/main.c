#include <stdio.h>
#include <gb/gb.h>
#include <gb/console.h>
#include <string.h>
#include "tiles.h"

#define BYTE unsigned char

void main()
{
    int px =5;
    int py =5;

    DISPLAY_OFF;
    set_tile_data(0, 3, TileLabel, 0x90);
    
    for (int y = 0; y < 18; y++)
    {
        for (int x = 0; x < 20; x++)
        {
            set_bkg_tile_xy(x, y, 0);
            if(y == 0 || y == 17 || x == 0 || x == 19){
                set_bkg_tile_xy(x,y,1);
            }
        }
    }
    
    SHOW_BKG;
    
    DISPLAY_ON;

    while (TRUE)
    {
                     set_bkg_tile_xy(px,py,2);
   
        wait_vbl_done();
    }
}