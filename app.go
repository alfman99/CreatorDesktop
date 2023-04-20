package main

import (
	"context"
	"fmt"
	"os/exec"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Calls Creator.exe with the given arguments
func (a *App) CallCreator(originalPe string, stubPath string, outputPath string, apiKey string) {
	cmd := exec.Command("X:\\Carrera\\__TFG\\development\\__Protector\\CreatorDesktop\\Creator.exe", originalPe, stubPath, outputPath, apiKey)
	if err := cmd.Run(); err != nil {
		fmt.Println(err)
	}
}
