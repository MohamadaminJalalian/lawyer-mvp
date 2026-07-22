// CaseManagement.Domain/ValueObjects/CourtInfo.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

namespace CaseManagement.Domain.ValueObjects;

public sealed class CourtInfo
{
    public string? CourtCaseNumber { get; private set; }
    public string? CourtName { get; private set; }
    public string? OpponentName { get; private set; }

    // EF Core needs a private parameterless constructor
    private CourtInfo()
    {
    }

    private CourtInfo(string? courtCaseNumber, string? courtName, string? opponentName)
    {
        CourtCaseNumber = courtCaseNumber;
        CourtName = courtName;
        OpponentName = opponentName;
    }

    public static CourtInfo Create(string? courtCaseNumber, string? courtName, string? opponentName)
    {
        return new CourtInfo(courtCaseNumber, courtName, opponentName);
    }

    public CourtInfo WithCourtCaseNumber(string? courtCaseNumber) =>
        new CourtInfo(courtCaseNumber, CourtName, OpponentName);

    public CourtInfo WithCourtName(string? courtName) =>
        new CourtInfo(CourtCaseNumber, courtName, OpponentName);

    public CourtInfo WithOpponentName(string? opponentName) =>
        new CourtInfo(CourtCaseNumber, CourtName, opponentName);
}
