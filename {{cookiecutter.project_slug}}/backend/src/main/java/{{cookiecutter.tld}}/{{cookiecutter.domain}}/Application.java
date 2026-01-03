package {{cookiecutter.tld}}.{{cookiecutter.domain}};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import io.trishul.tenant.persistence.config.PackageScanConfig;

@SpringBootApplication(scanBasePackages = { "{{cookiecutter.tld}}.{{cookiecutter.domain}}", "io.trishul" })
@EnableJpaRepositories(basePackages = { "{{cookiecutter.tld}}.{{cookiecutter.domain}}", "io.trishul" })
@EnableTransactionManagement
public class Application {
  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }

  @Bean
  @ConditionalOnMissingBean(PackageScanConfig.class)
  public PackageScanConfig packageScanConfig() {
    return () -> new String[] {};
  }
}
