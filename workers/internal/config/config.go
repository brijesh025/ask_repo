package config

import (
	"flag"
	"log"
	"os"
	"time"

	"github.com/ilyakaznacheev/cleanenv"
)

type HTTPServer struct {
	Address string        `yaml:"address" env-required:"true"`
	Timeout time.Duration `yaml:"timeout"`
}

type Database struct {
	URL string `yaml:"url" env:"DATABASE_URL" env-required:"true"`
}

type Config struct {
	Env        string     `yaml:"env" env:"ENV" env-default:"production"`
	Database   Database   `yaml:"database"`
	HTTPServer HTTPServer `yaml:"http_server"`
}

func MustLoad() *Config {
	configPath := os.Getenv("CONFIG_PATH")
	if configPath == "" {
		configFlag := flag.String("config", "", "path to the configuration file")
		flag.Parse()
		configPath = *configFlag
		if configPath == "" {
			log.Fatal("Configuration file path is not set")
		}
	}

	_, err := os.Stat(configPath)
	if os.IsNotExist(err) {
		log.Fatalf("not able to get the configuration file: %s", err)
	}

	var cnfg Config
	err = cleanenv.ReadConfig(configPath, &cnfg)
	if err != nil {
		log.Fatalf("Not able to read the content of the configuration file: %s", err)
	}
	return &cnfg
}
