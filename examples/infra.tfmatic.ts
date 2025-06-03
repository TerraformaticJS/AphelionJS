const sector = 'alpha_centauri';
const config = {
    block: ['terraform'],
    attr: {},
    child: [
        {
            block: ['required_providers'],
            attr: {
                aws: { source: 'hashicorp/aws', version: '5.0.0' }
            }
        },
        {
            block: ['resource', 'aws_s3_bucket', 'comet_core'],
            attr: { bucket: `${sector}-asteroid-belt` },
            child: [
                {
                    block: ['trajectory'],
                    attr: { target_orbit: { $raw: 'aws_s3_logs.galaxy.id' } }
                }
            ]
        }
    ]
};
export default config;