package config

import (
	"flag"
	"log"
	"os"
	"time"

	"github.com/ilyakaznacheev/cleanenv"
)

func main() {

}

type HTTPServer struct {
	Address string 		  `yaml:"address" env-required:"true"`
	Timeout time.Duration `yaml:"timeout"`
}

type Config struct {
	Env		string 		  `yaml:"env" env:"ENV" env-default:"production"`
	StoragePath string    `yaml:"string_path" env-required:"true"`
	HTTPServer HTTPServer `yaml:"http_server"`
}

func MustLoad() *Config {
	var configPath = os.Getenv(("CONFIG_PATH"))
	if (configPath == ""){
		confg_flags := flag.String("config", "", "path to the configuration file")
		flag.Parse()
		configPath = *confg_flags
		if(configPath==""){
			log.Fatal("Configuration file path is not set")
		}
	}

	_ , err := os.Stat(configPath) //return the information of passed file
	if(os.IsNotExist(err)){
		log.Fatalf("not able to get the configuration file: %s",err)
	}
	
	var cnfg Config
	err = cleanenv.ReadConfig(configPath, cnfg)
	if(err!=nil){
		log.Fatalf("Not able to read the content of the configuration file: %s", err)
	}
	return &cnfg
} 