package main

import (
	"context"
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

// Return codes from Creator.exe
const (
	SUCCESS                     int8 = 0
	ERROR_ORIGINAL_PE_NOT_FOUND int8 = -1
	ERROR_STUB_NOT_FOUND        int8 = -2
	ERROR_EXE_TO_DLL            int8 = -3
	ERROR_REGISTER_PROJECT      int8 = -4
	UNEXPECTED_ERROR            int8 = -5
)

// Calls Creator.exe with the given arguments
func (a *App) CallCreator(originalPe string, outputPath string, apiKey string) int8 {
	cmd := exec.Command("X:\\Carrera\\__TFG\\development\\__Protector\\CreatorDesktop\\dependencies\\Creator.exe", originalPe, "X:\\Carrera\\__TFG\\development\\__Protector\\CreatorDesktop\\dependencies\\Stub.exe", outputPath, apiKey)
	if err := cmd.Run(); err != nil {
		if exitError, ok := err.(*exec.ExitError); ok {
			return int8(exitError.ExitCode())
		}
		return UNEXPECTED_ERROR
	}
	return SUCCESS
}
