using System.Diagnostics;
using System.Text;
using FluentAssertions;

namespace DotNetTemplate.Tests;

public class TemplateIntegrationTests
{
    [Fact]
    public void Template_BmmSln_CreateProject()
    {
        UpdateNuGetTemplate();
        // Arrange
        var templateName = "dotnet-api";
        var projectName = "TestProject";
        var tempDirectory = "./tests";

        if (Directory.Exists(tempDirectory))
        {
            Directory.Delete(tempDirectory, true);
        }

        // The template should be created in less than 30sec  
        var timeout = TimeSpan.FromSeconds(100);
        Directory.CreateDirectory(tempDirectory);

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

        if (process!.WaitForExit((int)timeout.TotalMilliseconds))
        {
            var output = process.StandardOutput.ReadToEnd();
            var error = process.StandardError.ReadToEnd();

            process.ExitCode.Should().Be(0, because: error);
        }
        else
        {
            process.Kill();
            throw new TimeoutException("Le processus de création du projet a dépassé le délai imparti.");
        }

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

        var buildOutput = new StringBuilder();
        var buildError = new StringBuilder();

        buildProcess.OutputDataReceived += (sender, args) => buildOutput.AppendLine(args.Data);
        buildProcess.ErrorDataReceived += (sender, args) => buildError.AppendLine(args.Data);

        buildProcess.Start();
        buildProcess.BeginOutputReadLine();
        buildProcess.BeginErrorReadLine();

        // Doesn't work for some reason - it's timeout
        if (buildProcess!.WaitForExit((int)timeout.TotalMilliseconds))
        {
            buildProcess.WaitForExit();
            buildProcess.ExitCode.Should().Be(0, because: buildOutput.ToString());
        }
        else
        {
            buildProcess.Kill();
            throw new TimeoutException("Le processus de création du projet a dépassé le délai imparti.");
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
        output.Should().Contain("dotnet-api");
        output.Should().Contain("dotnet-react");
        powerShell.WaitForExit();
    }
}