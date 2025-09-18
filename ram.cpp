#include <graphics.h>
#include <conio.h>
#include <dos.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "");
    initwindow(800, 600, "Traffic Scene");


    for (int x = 0; x <= 300; x += 5) {
        cleardevice();

        // Sky
        setcolor(BLUE);
        setfillstyle(SOLID_FILL, CYAN);
        rectangle(0, 0, getmaxx(), 400);
        floodfill(2, 2, BLUE);

        // Sun
        setcolor(YELLOW);
        setfillstyle(SOLID_FILL, YELLOW);
        circle(500, 70, 30);
        floodfill(500, 70, YELLOW);

        // Airplane
        setcolor(WHITE);
        line(100 + x, 80, 170 + x, 80); // body
        line(120 + x, 70, 140 + x, 80); // top wing
        line(120 + x, 90, 140 + x, 80); // bottom wing
        line(170 + x, 80, 180 + x, 75); // tail wing top
        line(170 + x, 80, 180 + x, 85); // tail wing bottom

        // Road
        setcolor(WHITE);
        setfillstyle(SOLID_FILL, DARKGRAY);
        rectangle(0, 350, getmaxx(), 400);
        floodfill(2, 351, WHITE);

        // Road lines
        setcolor(YELLOW);
        for (int i = 0; i < getmaxx(); i += 40) {
            line(i, 375, i + 20, 375);
        }

        // Trees
        setcolor(BROWN);
        setfillstyle(SOLID_FILL, BROWN);
        rectangle(120, 320, 130, 350);
        floodfill(121, 321, BROWN);
        setcolor(GREEN);
        setfillstyle(SOLID_FILL, GREEN);
        circle(125, 305, 20);
        floodfill(125, 305, GREEN);

        setcolor(BROWN);
        setfillstyle(SOLID_FILL, BROWN);
        rectangle(160, 320, 170, 350);
        floodfill(161, 321, BROWN);
        setcolor(GREEN);
        setfillstyle(SOLID_FILL, GREEN);
        circle(165, 305, 20);
        floodfill(165, 305, GREEN);

        // Buildings
        setcolor(BLUE);
        setfillstyle(SOLID_FILL, LIGHTBLUE);
        rectangle(400, 200, 440, 320);
        floodfill(401, 201, BLUE);
        rectangle(450, 180, 490, 320);
        floodfill(451, 181, BLUE);
        rectangle(500, 220, 540, 320);
        floodfill(501, 221, BLUE);

        // Traffic Light Pole
        setcolor(WHITE);
        rectangle(200, 250, 210, 350);
        setfillstyle(SOLID_FILL, WHITE);
        floodfill(201, 251, WHITE);

        // Traffic Light Box
        rectangle(190, 200, 220, 250);
        setfillstyle(SOLID_FILL, LIGHTGRAY);
        floodfill(191, 201, WHITE);

        // Traffic Lights (Red, Yellow, Green)========================
        setcolor(RED);
        setfillstyle(SOLID_FILL, RED);
        circle(205, 210, 7);
        floodfill(205, 210, RED);

        setcolor(YELLOW);
        setfillstyle(SOLID_FILL, YELLOW);
        circle(205, 225, 7);
        floodfill(205, 225, YELLOW);

        setcolor(GREEN);
        setfillstyle(SOLID_FILL, GREEN);
        circle(205, 240, 7);
        floodfill(205, 240, GREEN);

// DRAW MAN BEFORE CAR, INSIDE LOOP
setcolor(RED);
circle(650, 290, 10);            // Head
floodfill(650, 290, RED);
line(650, 300, 650, 350);        // Body
line(650, 310, 630, 330);        // Left Arm
line(650, 310, 670, 330);        // Right Arm
line(650, 350, 630, 380);        // Left Leg
line(650, 350, 670, 380);        // Right Leg



        // Car===========
        setcolor(RED);
        setfillstyle(SOLID_FILL, RED);
        rectangle(50 + x, 320, 150 + x, 350);
        floodfill(51 + x, 321, RED);

        setcolor(LIGHTRED);
        setfillstyle(SOLID_FILL, LIGHTRED);
        rectangle(70 + x, 300, 130 + x, 320);
        floodfill(71 + x, 301, LIGHTRED);

        setcolor(BLACK);
        setfillstyle(SOLID_FILL, BLACK);
        circle(70 + x, 350, 10);
        floodfill(70 + x, 350, BLACK);
        circle(130 + x, 350, 10);
        floodfill(130 + x, 350, BLACK);

        delay(100);


            // Triangle draw karna
    line(200, 100, 100, 300); // Left side
    line(200, 100, 300, 300); // Right side
    line(100, 300, 300, 300); // Base
        




    }

    getch();
    closegraph();
    return 0;
}
