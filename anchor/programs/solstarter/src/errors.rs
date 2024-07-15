use anchor_lang::prelude::*;

#[error_code]
pub enum CreateProjectError {
    #[msg("Project already exists")]
    AlreadyExists,
    #[msg("Invalid parameters")]
    InvalidParameters,
}
