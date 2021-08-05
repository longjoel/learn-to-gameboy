#include <stdio.h>
#include <gb/gb.h>
#include <gb/console.h>
#include <string.h>

#define SCREEN_W 20
#define SCREEN_H 17

#define BYTE unsigned char

BYTE buffer[(SCREEN_H * SCREEN_W)+1];

void main()
{
    BYTE px = 5;
    BYTE py = 5;

    while (TRUE)
    {

        memset(&buffer[0], ' ', SCREEN_W * SCREEN_H);
        gotoxy(0, 0);
       
        for (int i = 0; i < SCREEN_H; i++)
        {
            for (int j = 0; j < SCREEN_W; j++)
            {
                if (i == 0 || j == 0 || i == SCREEN_H - 1 || j == SCREEN_W - 1)
                {
                    buffer[i * SCREEN_W + j] = '*';
                }
            }
        }
        buffer[(SCREEN_H * SCREEN_W)]=0;

        buffer[(py*SCREEN_W)+px] = '&';

    BYTE pad = joypad();

    if ((px) > 1 && (pad & J_LEFT)){
        px-= 1;
    } 

     if (px < (SCREEN_W-2) && (pad & J_RIGHT)){
        px+= 1;
    }   

     if ((py) > 1 && (pad & J_UP)){
        py-= 1;
    } 

     if (py < (SCREEN_H-2) && (pad & J_DOWN)){
        py+= 1;
    }    
        
        printf(buffer);
        printf("GB MAZE");
    }
}