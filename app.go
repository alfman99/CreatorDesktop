package main

import (
	"bytes"
	"context"
	"fmt"
	"os/exec"
	"syscall"

	"github.com/wailsapp/wails/v2/pkg/runtime"
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
)

// Calls Creator.exe with the given arguments
func (a *App) CallCreator(originalPe string, outputPath string, apiKey string) int32 {
	// Call Creator.exe
	cmd := exec.Command("./Creator.exe", originalPe, "./Stub.exe", outputPath, apiKey)
	var out bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &stderr
	err := cmd.Run()

	fmt.Println(fmt.Sprint(err) + ": " + stderr.String())
	fmt.Println("Result: " + out.String())

	if err != nil {
		if e2, ok := err.(*exec.ExitError); ok {
			if s, ok := e2.Sys().(syscall.WaitStatus); ok {
				code := int32(s.ExitCode)
				fmt.Println("Exit code: ", code)
				return code
			}
		}
		return int32(SUCCESS)
	}
	return int32(SUCCESS)
}

// SelectOriginalPE opens a file dialog and returns the selected file
func (a *App) SelectOriginalPE() string {
	file, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Aplicación",
				Pattern:     "*.exe",
			},
		},
	})
	if err != nil {
		return err.Error()
	}
	return file
}

// SetSavePath opens a file dialog and returns the selected file
func (a *App) SetSavePath() string {
	file, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Aplicación",
				Pattern:     "*.exe",
			},
		},
	})
	if err != nil {
		return err.Error()
	}
	return file
}
