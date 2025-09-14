package activation

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/shirou/gopsutil/cpu"
	"log"
	"net/http"
	"strings"
	"time"
	//	"os"
)

const (
	activatorPublicKey string = `-----BEGIN PUBLIC KEY-----
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
-----END PUBLIC KEY-----`
	servicePrivateKey string = `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----`
)

var (
	activationState ActivationState
	processor       string
)

func Authorise(c *gin.Context) {
	if !activationState.Status {
		log.Println("Product not activated")
		c.Status(http.StatusForbidden)
		c.Abort()
	}

	c.Next()
}

func Initialise(router *gin.Engine) {
	activationState = ActivationState{
		Status:  false,
		Code:    generateCode(),
		Key:     "",
		EndDate: "",
	}
	updateState()
	router.GET("/activation/state", state)
}

func state(c *gin.Context) {
	updateState()
	c.IndentedJSON(200, activationState)
}

func updateState() {
	activationState.Key = key()
	activationState.Status = isActive()
}

func key() string {
	return "KYGd5+F8f180fmffo8NLoEywpFpLov/9OVKgEry+6nRHZ4pooBk2YBFMJFaLBWBpRrQdCXcjcY8z2+CE8j2YBFkOEH7NeFXLvHidpUTzSKo3kdRkyKkS6jeUVHCALf66bPiJ+Yc1FOGCLiO70Nn7hT9rJ5Wx9I6/AJ4fL4Vyh9FSxJzW1MX/bqfS6vl3q1a3fMqTniH05Z+lRntEPONY5LRLRVn2UMFo0cKckhNbvr17bTfjNfNB/z/0A/GUD1ASOWT3TiMLhESVOSkGOm0MX5aVk6bcApBq+6iS1qA/LJHIJTfem6QlMZjpHNL0OKLlR7UoDhswciTUi6hkU5uP55ClR0yQAwfYnvmxWcl13q14SbZmzYm+R47sPFqgIKya5ImqFERY1WiGjFPQCt5nzWmj266bWVWggwwiDQFd45LVmz6ZVMe67MrH4OruJXFmiEiPSOl71Yf4W0V5IoeRISZ/NLpnLArDhVzC2+KVPRfTTRC7car+hhovkCx4xXxzGE84wfWPLyRO5kwuBknBL9AWyFtu/6c9WTt6ZxCyK9CoM3QWfLFjEmd0bafIJmpCjGuWQdJTqMACKxMip6fhQXN2whsg74J2791GMLGWH4rbPzeEm3aym+eht2i8bl+LwcEqT3n2nmr/4PNF0SjVBGq54Krk1Kz+h9s60rNMe/4="
	//	return os.Getenv("PIPELINE_ACTIVATION_KEY")
}

func isActive() bool {
	if activationState.Code == "" || activationState.Key == "" {
		return false
	}

	decryptedKey, err := rsaDecrypt(servicePrivateKey, activationState.Key)
	if err != nil {
		log.Println("failed to decrypt key")
		return false
	}

	parts := strings.Split(decryptedKey, "_")
	endDate, err := time.Parse("02/01/2006 15:04:05", parts[1])

	if err != nil {
		log.Println("failed to parse end date")
		return false
	}

	activationState.EndDate = endDate.String()
	if parts[0] == processor && endDate.After(time.Now().UTC()) {
		return true
	}

	return false
}

func generateCode() string {
	info, err := cpu.Info()
	if err != nil {
		panic(err)
	}

	processorId := info[0].PhysicalID
	if processorId != "" {
		processor = processorId
		encrypted, err := rsaEncrypt(activatorPublicKey, processorId)

		if err != nil {
			panic(err.Error())
		}
		log.Println(encrypted)
		return encrypted
	} else {
		panic("no processor ID")
	}
}

func rsaEncrypt(publicKey string, plainText string) (string, error) {
	block, _ := pem.Decode([]byte(publicKey))
	if block == nil {
		return "", errors.New("failed to parse PEM block containing the public key")
	}

	pub, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return "", errors.New("failed to parse DER encoded public key: " + err.Error())
	}

	pk, _ := pub.(*rsa.PublicKey)
	encryptedBytes, err := rsa.EncryptPKCS1v15(
		rand.Reader,
		pk,
		[]byte(plainText),
	)
	if err != nil {
		return "", errors.New("failed to encrypt")
	}

	return base64.StdEncoding.EncodeToString(encryptedBytes), nil
}

func rsaDecrypt(privateKey string, encryptedText string) (string, error) {
	block, _ := pem.Decode([]byte(privateKey))
	if block == nil {
		return "", errors.New("failed to parse PEM block containing the private key")
	}

	priv, err := x509.ParsePKCS1PrivateKey(block.Bytes)
	if err != nil {
		return "", errors.New("failed to parse DER encoded private key: " + err.Error())
	}

	encryptedBytes, err := base64.StdEncoding.DecodeString(encryptedText)

	if err != nil {
		return "", errors.New("failed to decode string")
	}

	decryptedBytes, err := rsa.DecryptPKCS1v15(
		rand.Reader,
		priv,
		encryptedBytes,
	)
	if err != nil {
		return "", errors.New("failed to decrypt")
	}

	return string(decryptedBytes), nil
}
