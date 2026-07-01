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
type LocalStorage struct {
	Path string `yaml:"path"`
}

type Embedding struct {
	Provider   string `yaml:"provider" env:"EMBEDDING_PROVIDER" env-default:"gemini"`
	Model      string `yaml:"model" env:"EMBEDDING_MODEL" env-default:"gemini-embedding-001"`
	Dimensions int    `yaml:"dimensions" env:"EMBEDDING_DIMENSIONS" env-default:"1536"`
}

type LLM struct {
	Provider    string  `yaml:"provider" env:"LLM_PROVIDER" env-default:"gemini"`
	Model       string  `yaml:"model" env:"LLM_MODEL" env-default:"gemini-3.5-flash"`
	Temperature float64 `yaml:"temperature" env:"LLM_TEMPERATURE" env-default:"0.2"`
}

type Config struct {
	Env          string       `yaml:"env" env:"ENV" env-default:"production"`
	Database     Database     `yaml:"database"`
	HTTPServer   HTTPServer   `yaml:"http_server"`
	LocalStorage LocalStorage `yaml:"local_storage"`
	Embedding    Embedding    `yaml:"embedding"`
	LLM          LLM          `yaml:"llm"`
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
