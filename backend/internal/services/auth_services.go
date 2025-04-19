package services

import (
	"net/http"
	"profix-service/internal/models"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	// "github.com/restaurent_table_booking/internal/models"
	// "github.com/restaurent_table_booking/internal/utils"
	// pkg "github.com/restaurent_table_booking/pkg/email"
)

type PinData struct {
	Pin      int       `json:"pin"`
	ExpireAt time.Time `json:"expire_at"`
	Attempt  int       `json:"attempt"`
}

// Bộ nhớ tạm lưu PIN (dùng sync.Map để thread-safe)
var pinStorage = sync.Map{}

func Register(context *gin.Context) {
	var user models.User
	err := context.ShouldBindBodyWithJSON(&user)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Can't read your input information"})
		return
	}
	_ , err = user.Create()
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}  else {
		context.JSON(http.StatusBadRequest, gin.H{"message": "role not included"})
	}

	context.JSON(http.StatusCreated, gin.H{"Message": "Register successfully !!"})
}

// func Login(context *gin.Context) {
// 	if _, err := context.Cookie("token"); err == nil {
// 		context.JSON(http.StatusBadRequest, gin.H{"message": "You have already logged in"})
// 		return
// 	}

// 	var user models.User
// 	if err := context.ShouldBindJSON(&user); err != nil {
// 		context.JSON(http.StatusBadRequest, gin.H{"message": "Can't read your input information"})
// 		return
// 	}

// 	if err := user.Login(); err != nil {
// 		context.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
// 		return
// 	}

// 	token, err := utils.GenerateToken(user.Id, user.Email, user.Role)
// 	if err != nil {
// 		context.JSON(http.StatusUnauthorized, gin.H{"message": "Can't generate token"})
// 		return
// 	}

// 	// Chỉ set 1 cookie
// 	context.SetCookie("token", token, 7200, "/", "", false, true)

// 	context.JSON(http.StatusOK, gin.H{
// 		"message": "Login successfully !!",
// 		"token":   token,
// 		"role":    user.Role,
// 	})
// }

// func ResendPin(context *gin.Context) {
// 	var input struct {
// 		Email string `json:"email"`
// 	}

// 	if err := context.ShouldBindJSON(&input); err != nil {
// 		context.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input"})
// 		return
// 	}

// 	// Kiểm tra xem email có tồn tại không
// 	_, exists := pinStorage.Load(input.Email)
// 	if !exists {
// 		context.JSON(http.StatusBadRequest, gin.H{"message": "Email không hợp lệ hoặc PIN đã hết hạn"})
// 		return
// 	}

// 	// Tạo mã PIN mới
// 	// newPin := pkg.RandomPin()
// 	fmt.Println("Mã PIN mới được gửi cho:", input.Email)
// 	// pkg.SendMailSimple(input.Email, newPin)

// 	// Cập nhật bộ nhớ tạm
// 	newPinData := PinData{
// 		// Pin:      newPin,
// 		ExpireAt: time.Now().Add(2 * time.Minute),
// 		Attempt:  0,
// 	}
// 	pinStorage.Store(input.Email, newPinData)

// 	context.JSON(http.StatusOK, gin.H{"message": "Mã PIN mới đã được gửi!"})
// }

// func GetUserProfile(c *gin.Context) {
// 	c.GetString("role")
// 	role := c.GetString("role")
// 	if role == "" {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Can not get role"})
// 		return
// 	}
// 	c.GetInt64("userID")
// 	userID := c.GetInt64("userID")
// 	if userID == 0 {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Can not get user id"})
// 		return
// 	}

// 	var user models.User
// 	user, err := models.GetUserInformationById(userID, role)
// 	if err != nil {
// 		// "Can not find user"
// 		c.JSON(http.StatusUnauthorized, gin.H{"error (get User Profile)": err.Error()})
// 	}

// 	c.JSON(http.StatusOK, gin.H{"user": user})
// }

// // LogoutHandler xử lý đăng xuất
// func Logout(c *gin.Context) {
// 	// Xóa cookie bằng cách đặt giá trị rỗng và thời gian hết hạn đã qua
// 	c.SetCookie("token", "", -1, "/", "localhost", false, true)
// 	c.SetCookie("token", "", -1, "/", "192.168.16.55", false, true)
// 	// Trả về phản hồi JSON
// 	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
// }

// func ForgotPassword(context *gin.Context) user
// 	var u models.User

// 	// Đọc thông tin từ request body
// 	if err := context.ShouldBindJSON(&u); err != nil {
// 		context.JSON(http.StatusBadRequest, gin.H{"message": "Can't read your input information"})
// 		return
// 	}

// 	// Kiểm tra tài khoản có tồn tại không
// 	_, exists := models.CheckUser(&u)
// 	if exists {
// 		context.JSON(http.StatusBadRequest, gin.H{"message": "Don't have any User like this"})
// 		return
// 	}

// 	// Kiểm tra trạng thái tài khoản
// 	if u.Status == "inactive" || u.Status == "ban" {
// 		context.JSON(http.StatusForbidden, gin.H{"message": "Your User is inactive or banned. You cannot reset your password."})
// 		return
// 	}

// 	// Tạo mã PIN ngẫu nhiên
// 	// pin := pkg.RandomPin()

// 	pinData := PinData{
// 		// Pin:      pin,
// 		ExpireAt: time.Now().Add(2 * time.Minute),
// 		Attempt:  0,
// 	}
// 	// Lưu mã PIN vào bộ nhớ tạm (kèm thời gian hết hạn)
// 	pinStorage.Store(u.Email, pinData)

// 	// Gửi mã PIN qua email
// 	// pkg.SendMailSimple(u.Email, pin)

// 	context.JSON(http.StatusOK, gin.H{"message": "Send mail successfully !!"})
// }

// // Check mã PIN
// func CheckPin(context *gin.Context) user
// 	type PinInput struct {
// 		Email string `json:"email"`
// 		Pin   int    `json:"pin"`
// 	}

// 	var input PinInput
// 	var acc models.User

// 	// Đọc dữ liệu từ request body
// 	if err := context.ShouldBindJSON(&input); err != nil {
// 		context.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input"})
// 		return
// 	}

// 	// Lấy mã PIN từ bộ nhớ tạm
// 	value, exists := pinStorage.Load(input.Email)
// 	if !exists {
// 		context.JSON(http.StatusBadRequest, gin.H{"message": "PIN expired or email not found"})
// 		return
// 	}
// 	acc.Email = input.Email
// 	storedPin := value.(PinData)

// 	_, _ = models.CheckUser(&acc)

// 	// Kiểm tra mã PIN nhập vào có đúng không
// 	if storedPin.Pin != input.Pin {
// 		storedPin.Attempt++
// 		remainingAttempts := 5 - storedPin.Attempt
// 		if storedPin.Attempt >= 5 {
// 			err := models.SetUserStatusInactive(input.Email, acc.Role)
// 			if err != nil {
// 				context.JSON(http.StatusInternalServerError, gin.H{"message": "Can't change into inactive"})
// 				return
// 			}
// 			// pkg.SendMailWarning(input.Email)
// 			context.JSON(http.StatusForbidden, gin.H{"message": "You have entered the wrong PIN more than 5 times. We blocked you."})
// 			return
// 		}

// 		pinStorage.Store(input.Email, storedPin)
// 		context.JSON(http.StatusBadRequest, gin.H{
// 			"message": fmt.Sprintf("Wrong PIN. You have %d attempts left.", remainingAttempts),
// 		})
// 		return
// 	}

// 	// Xoá mã PIN sau khi kiểm tra thành công (để tránh dùng lại)
// 	pinStorage.Delete(input.Email)

// 	context.JSON(http.StatusOK, gin.H{"message": "Check successfully !!"})
// }

// func ChangePassword(context *gin.Context) {
// 	var pass models.NewPassword
// 	err := context.ShouldBindBodyWithJSON(&pass)
// 	if err != nil {
// 		context.JSON(http.StatusBadRequest, gin.H{"message": "Invalid Input"})
// 	}
// 	var acc models.User
// 	token, err := context.Cookie("token")
// 	if err != nil {
// 		context.JSON(http.StatusUnauthorized, gin.H{"error": "Can not get token from cookie"})
// 		context.Abort()
// 		return
// 	}
// 	claims, err := utils.ParseJWT(token)
// 	if err != nil {
// 		context.JSON(http.StatusUnauthorized, gin.H{"error": "Claim failse"})
// 		context.Abort()
// 		return
// 	}
// 	acc.Email = claims.Gmail
// 	err = acc.ChangePassword(pass)
// 	if err != nil {
// 		context.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
// 		return
// 	}
// 	context.JSON(http.StatusOK, gin.H{"message": "Change password succesfully!"})
// }

// func UpdateProfile(context *gin.Context) {
// 	var acc models.User
// 	var err error
// 	context.ShouldBindBodyWithJSON(&acc)
// 	if acc.Role == "staff" {
// 		err = acc.UpdateStaff()
// 	} else if acc.Role == "owner" {
// 		err = acc.UpdateOwner()
// 	} else if acc.Role == "customer" {
// 		err = acc.UpdateCustomer()
// 	}
// 	if err != nil {
// 		context.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
// 	}
// 	context.JSON(http.StatusOK, gin.H{"messge": "Update successfully!!"})
// }

// func ResetPassword(context *gin.Context) user
// 	var u models.User
// 	err := context.ShouldBindBodyWithJSON(&u)
// 	if err != nil {
// 		context.JSON(http.StatusBadRequest, gin.H{"message": "Can't read your input information"})
// 		return
// 	}
// 	err = u.ResetPassword()
// 	if err != nil {
// 		context.JSON(http.StatusBadRequest, gin.H{"message": "Can't reset password"})
// 		return
// 	}
// 	context.JSON(http.StatusOK, gin.H{"Message": "Reset password successfully !!"})
// }

// func GetAllUsers(context *gin.Context) {
// 	u, _ := models.GetAllUsers()
// 	context.JSON(http.StatusOK, gin.H{"users": u})
// }
