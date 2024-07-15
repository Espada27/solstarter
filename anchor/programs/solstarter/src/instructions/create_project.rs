use anchor_lang::prelude::*;

use crate::errors::CreateProjectError;
use crate::state::{Project, User};

pub fn create_project(ctx: Context<CreateProject>) -> Result<()> {
    let project = &ctx.accounts.project;

    ctx.accounts.user.created_project_counter += 1;

    Ok(())
}

#[derive(Accounts)]
pub struct CreateProject<'info> {
    #[account(
        mut, 
        seeds = [
            b"user", 
            signer.key().as_ref(),
        ], 
        bump
    )]
    pub user: Account<'info, User>,

    #[account(
        init, 
        payer = signer,
        space = 8 + Project::INIT_SPACE, 
        seeds = [
            b"project".as_ref(), 
            signer.key().as_ref(),
            &(user.created_project_counter + 1).to_le_bytes(),
        ],
        bump
    )]
    pub project: Account<'info, Project>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}
