using System.Security.Cryptography;
using System.Text;

const string ActivatorPrivateKey = @"-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----";

const string ShieldPublicKey = @"-----BEGIN PUBLIC KEY-----
MIICITANBgkqhkiG9w0BAQEFAAOCAg4AMIICCQKCAgBXcDqESBhTRnuyFfvzvSgX
h2Xda12UnV9WNEBBTbwWD7vDXh1a7Ty4Sfvxv6Eoi34rJJYaiABO/r2GxMUkFj67
J9v6x0rARZfuN//uFi64Y6YKnKo8WnGAHYCgT6dooanLmM8jCtHwosXaa/K5VQtW
mnLBlnOcEifUqY0mLF4f3NEPtxzGgQgwc7osdL7wDTvja4Fp/chRKhtFhMqdfjkR
WHfb/EjyNcOWHRxJ6VSUKR3IuxjXXpbXCkMYfVk3NZM4iDF/glGuQp/nAIVKspeQ
FdFajXmPP+tfA0EYFmsFAkR6TCvXddi/M1cQ/t59cP6Z0ZSpyi2if4BmqsQ813V0
2D5535Hta/JvViHX6LWUjZAdlvBDxg3CXy2ZJrYrtemDsCTUTw4uLYf4sO3i3hoM
VdmZCsaAphpKbUyFYR14Expz3+SjKvu8WfGNcbq/83cGCVyQDRYW/QpWvSyZb70u
uRbxzhuXSNzKZEAxE17uVpyHA2R3ByYL/dJ338PGFpKNn1hn3Ed+1sJZl2+bWLnP
rD+4gvLxyZpQh1hMRWtDwn7lmRcenMaUr++CH5wiLf56C3mzKGhJ/+C+fg5gAGdn
DiFGAvw33fEtIEaCDr5dZpPuJ+i4HnQoO3RAVni7tS0ZtyVoT6EHBJBWtk0wK7Eu
N+qRIq9gl3M1vVD4S4PEVQIDAQAB
-----END PUBLIC KEY-----";

while (true)
{
    Console.WriteLine("Enter Activation Code:");
    string activationCode = Console.ReadLine();
    Console.WriteLine("Enter Number of Days:");
    int.TryParse(Console.ReadLine(), out int days);

    if (!string.IsNullOrEmpty(activationCode))
    {
        string motherboardId = Decrypt(activationCode);
        Console.WriteLine("Motherboard ID: " + motherboardId);
        var endDate = DateTime.UtcNow.AddDays(days);
        Console.WriteLine("End Date: " + endDate.ToString());
        string code = motherboardId + "_" + endDate.ToString();
        string activationKey = Encrypt(code);
        Console.WriteLine("Activation Key:");
        Console.WriteLine(activationKey);
    }
    else
    {
        Console.WriteLine("Invalid Activation Code");
    }
}


string Decrypt(string activationCode)
{
    using var rsaCryptoService = new RSACryptoServiceProvider();
    rsaCryptoService.ImportFromPem(ActivatorPrivateKey);
    var encryptedBytes = Convert.FromBase64String(activationCode);
    var decryptedBytes = rsaCryptoService.Decrypt(encryptedBytes, false);
    var processorId = Encoding.UTF8.GetString(decryptedBytes);
    return processorId;

}

string Encrypt(string motherboardId)
{
    using var rsaCryptoService = new RSACryptoServiceProvider();
    rsaCryptoService.ImportFromPem(ShieldPublicKey);
    var utf8 = Encoding.UTF8.GetBytes(motherboardId);
    var encrypted = rsaCryptoService.Encrypt(utf8, false);
    return Convert.ToBase64String(encrypted);
}