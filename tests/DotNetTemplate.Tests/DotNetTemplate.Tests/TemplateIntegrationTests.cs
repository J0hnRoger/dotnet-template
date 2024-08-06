using System.Diagnostics;
using FluentAssertions;

namespace DotNetTemplate.Tests;

public class TemplateIntegrationTests
{
    [Fact]
    public void Template_BmmSln_CreateProject()
    {
        UpdateNuGetTemplate();
        // Arrange
        var templateName = "bmm-api";
        var projectName = "TestProject";
        var tempDirectory = "./tests";
        
        Directory.CreateDirectory(tempDirectory);

        try
        {
            var process = Process.Start(new ProcessStartInfo
            {
                FileName = "dotnet",
                Arguments = $"new {templateName} -n {projectName}",
                WorkingDirectory = tempDirectory,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            });

            process!.WaitForExit();
            var output = process.StandardOutput.ReadToEnd();
            var error = process.StandardError.ReadToEnd();

            process.ExitCode.Should().Be(0, because: error);
            Directory.Exists(Path.Combine(tempDirectory, projectName)).Should().BeTrue();

            var projectDirectory = Path.Combine(tempDirectory, projectName + "\\server");

            var buildProcess = Process.Start(new ProcessStartInfo
            {
                FileName = "dotnet",
                Arguments = $"build {projectName}.sln",
                WorkingDirectory = projectDirectory,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            });

            buildProcess!.WaitForExit();
            var buildOutput = buildProcess.StandardOutput.ReadToEnd();
            var buildError = buildProcess.StandardError.ReadToEnd();

            buildProcess.ExitCode.Should().Be(0, because: buildOutput);
        }
        finally
        {
            // Clean up
            if (Directory.Exists(tempDirectory))
            {
                Directory.Delete(tempDirectory, true);
            }
        }
    }

    private void UpdateNuGetTemplate()
    {
        using Process powerShell = new Process();
        powerShell.StartInfo.WorkingDirectory = @"C:\Personal\dotnet-template";
        powerShell.StartInfo.FileName = "powershell.exe";
        powerShell.StartInfo.Arguments = $"-ExecutionPolicy Unrestricted -File ./.scripts/publish.ps1";
        powerShell.StartInfo.UseShellExecute = false;
        powerShell.StartInfo.RedirectStandardOutput = true;
        powerShell.Start();
        string output = powerShell.StandardOutput.ReadToEnd();
            
        Console.WriteLine(output);
        output.Should().Contain("bmm-sln");
        output.Should().Contain("bmm-react");
        powerShell.WaitForExit();
    }
}