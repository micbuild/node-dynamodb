const fs = require('fs');
const { Router } = require('express');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

const router = Router();
const swaggerYaml = fs.readFileSync(process.env.SERVICE_DOCS_FILE_PATH || './docs/swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(swaggerYaml);

router.use(process.env.SERVICE_DOCS_PATH || '/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
