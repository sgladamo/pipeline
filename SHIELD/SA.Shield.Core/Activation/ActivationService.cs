using Hardware.Info;
using SA.Shield.Core.Logging;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;

namespace SA.Shield.Core.Activation
{
    public class ActivationService
    {
        private static readonly IHardwareInfo _hardwareInfo = new HardwareInfo();

        private const string ActivatorPublicKey = @"-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAkkblosfDBbM2YpqGmALu
snMvQDMT9WoPSF9xdMCc4mDbEuEAEidh/TIhI58WN/Fhk6u7Rn56F9VewmdbTp6x
vVYC0pqvRuKFUyT1KuupUOtuwQWZY4txKGnEUlzkFjmaEZMO0AhGxIv8LYWpkf2n
z3S0/2PYX4rsv7tGpgWDM7SC6W1XkemwxUJ7E0H83zqxI4q3JB94NfVuscUoY7a/
+qkWEkSmclasdRUV3ltBtduJAlvfxtZNxnYKWFdNCexxQGvlJ15YxaLMbG4gF2/a
UXqi0MTL0kXFEgGVvWWCFnDpT4FBzexdNAOEVho09+D0CwrQlG5vH3AuytMkMq+Q
JGUNFKaGwvTg5eC9MjYRlx6F/mVeorzeMhCGYi+m9M+CR4dYGWRJAqoRRdAQXs/K
tI+Z2DZu3gE31pisymuWS/+9S5FTCKctGunaF1tGdQvNFvwbobSHlVYXqNYmRomy
Afx56elCyhej9lQ24SA9x628H1hYTCnMGsNRp8SlaMkjA2x4Oc0Lpk/cg0mMs6cV
cm6F6Q0zyDhPErGD08nKQUoX21IUsZx1p4VlPs3haRaj50zTIbakPBCxgIPxr85/
WgEJ4Q05zl+w37H9f1EHqqVGabsJ9zYBsGild8ygo2QjRsdEGwU2OSxDVik8asHO
0LQA9xPvAY4EqMIHEI+kT7ECAwEAAQ==
-----END PUBLIC KEY-----";

        private const string ShieldPrivateKey = @"-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----";

        private static string? MotherboardID { get; set; }

        public static DateTime? EndDate { get; set; }

        public static bool IsActive
        {
            get
            {
                if (ActivationCode != null && ActivationKey != null && DecryptedActivationKey != null && MotherboardID != null)
                {
                    string[] keyParts = DecryptedActivationKey.Split("_");
                    _ = DateTime.TryParseExact(keyParts[1], "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out DateTime endDate);
                    EndDate = endDate;
                    return keyParts[0] == MotherboardID && endDate >= DateTime.UtcNow;
                }
                else { return false; }
            }
        }

        public static string? ActivationCode { get; set; }

        public static string? ActivationKey
        {
            get
            {
                return Environment.GetEnvironmentVariable("PIPELINE_ACTIVATION_KEY");
            }
        }

        private static string? DecryptedActivationKey
        {
            get
            {
                try
                {
                    if (ActivationKey != null)
                    {
                        using var rsaCryptoService = new RSACryptoServiceProvider();
                        rsaCryptoService.ImportFromPem(ShieldPrivateKey);
                        var encryptedBytes = Convert.FromBase64String(ActivationKey);
                        var decryptedBytes = rsaCryptoService.Decrypt(encryptedBytes, false);
                        var motherboardId = Encoding.UTF8.GetString(decryptedBytes);
                        return motherboardId;
                    }
                    else
                    {
                        return null;
                    }
                }
                catch (Exception)
                {
                    Logger.Error("Failed to decrypt activation key");
                    return null;
                }
            }
        }

        public static ActivationState ActivationState
        {
            get => new()
            {
                Status = IsActive,
                Code = ActivationCode,
                Key = ActivationKey,
                EndDate = EndDate
            };
        }

        public void GenerateActivationCode()
        {
            try
            {
                _hardwareInfo.RefreshAll();

                if (_hardwareInfo.CpuList.Count > 0)
                {
                    var motherboardId = _hardwareInfo.MotherboardList[0].SerialNumber;
                    //var processorId = _hardwareInfo.CpuList[0].ProcessorId;
                    MotherboardID = motherboardId;
                    using var rsaCryptoService = new RSACryptoServiceProvider();
                    rsaCryptoService.ImportFromPem(ActivatorPublicKey);
                    var utf8Bytes = Encoding.UTF8.GetBytes(motherboardId);
                    var encrypted = rsaCryptoService.Encrypt(utf8Bytes, false);
                    ActivationCode = Convert.ToBase64String(encrypted);
                }
            }
            catch (Exception)
            {
                Logger.Error("Error generating activation code.");
            }
        }
    }
}
