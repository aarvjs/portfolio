#include <graphics.h>
#include <conio.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "");


    setcolor(DARKGRAY);
    setfillstyle(SOLID_FILL,DARKGRAY);
    rectangle(0,370,getmaxx(),getmaxy());
    floodfill(1,371,DARKGRAY);


   
    getch();
    closegraph();
    return 0;
}
