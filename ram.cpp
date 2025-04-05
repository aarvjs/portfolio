#include <graphics.h>
#include <math.h>
#include <dos.h>

// Chakra draw function
void drawChakra(int x, int y, int r) {
    setcolor(BLUE);
    circle(x, y, r);
    for (int i = 0; i < 24; i++) {
        float angle = i * (360.0 / 24);
        float rad = angle * M_PI / 180;
        int x2 = x + r * cos(rad);
        int y2 = y + r * sin(rad);
        line(x, y, x2, y2);
    }
}

// Sunset background
void drawSunset() {
    for (int i = 0; i < 400; i++) {
        setcolor(COLOR(255 - i/2, 100 - i/4, 0));  // orange to dark red
        line(0, i, getmaxx(), i);
    }

    // Sun
    setfillstyle(SOLID_FILL, YELLOW);
    fillellipse(500, 350, 40, 40);
}

// Tree drawing
void drawTree(int x, int y) {
    setfillstyle(SOLID_FILL, BROWN);
    bar(x, y - 60, x + 20, y); // trunk

    setfillstyle(SOLID_FILL, GREEN);
    fillellipse(x + 10, y - 70, 30, 30);
    fillellipse(x - 10, y - 90, 30, 30);
    fillellipse(x + 30, y - 90, 30, 30);
}

// Static background setup
void drawStaticScene() {
    drawSunset();
    drawTree(80, 400);

    // Flag pole
    setcolor(WHITE);
    line(150, 150, 150, 300);
}

// Waving stripes only
void drawWaveStripe(int baseX, int baseY, int width, int height, int color, int frameOffset) {
    setcolor(color);
    setfillstyle(SOLID_FILL, color);

    for (int i = 0; i < width; i++) {
        int waveY = (int)(5 * sin((i + frameOffset) * 0.05));
        line(baseX + i, baseY + waveY, baseX + i, baseY + waveY + height);
    }
}

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, const_cast<char*>(""));

    // Draw static background once
    drawStaticScene();

    int frame = 0;

    // Animation loop (no screen clear)
    while (!kbhit()) {
        // Waving stripes
        drawWaveStripe(151, 150, 300, 20, COLOR(255, 153, 51), frame);        // Saffron
        drawWaveStripe(151, 170, 300, 20, WHITE, frame + 10);                // White
        drawWaveStripe(151, 190, 300, 20, COLOR(19, 136, 8), frame + 20);    // Green

        // Chakra
        drawChakra(300, 180, 10);

        frame += 2;
        delay(50);
    }

    getch();
    closegraph();
    return 0;
}
