#include <stdio.h>
#include <gb/gb.h>
#include <gb/console.h>
#include <string.h>
#define SCREEN_W 20
#define SCREEN_H 18
char buffer[(SCREEN_H * SCREEN_W)];

void main()
{
    while (TRUE)
    {

        memset(&buffer[0], ' ', SCREEN_W * SCREEN_H);
       
        for (int i = 0; i < SCREEN_H; i++)
        {
            for (int j = 0; j < SCREEN_W; j++)
            {
                if (!(i == 0 || j == 0 || i == SCREEN_H - 1 || j == SCREEN_W - 1))
                {
                   
                    buffer[i * SCREEN_W + j] = '^';
                }
            }
        }
        buffer[(SCREEN_H * SCREEN_W)-1]=0;
        
        printf("%s", buffer);
        gotoxy(0, 0);
    }
}